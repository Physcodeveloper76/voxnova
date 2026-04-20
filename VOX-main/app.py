from flask import Flask, render_template, request, jsonify, url_for, redirect, send_from_directory
from flask_cors import CORS
import joblib
import cv2
import numpy as np
import mediapipe as mp
from urllib.parse import urlparse

# 🔊 Translation + Voice
from googletrans import Translator
from gtts import gTTS
import time
import os
import threading
from collections import deque
from playsound import playsound

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
MODEL_PATH = os.path.join(BASE_DIR, "sign_language_model.pkl")
DICTIONARY_PATH = os.path.join(BASE_DIR, "word_dictionary.pkl")
SIGNING_PORTABLE_DIR = os.path.join(os.path.dirname(BASE_DIR), "ISL model", "signing-portable")

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

# Trusted domains/origins for local development.
trusted_origins = [
    "http://127.0.0.1:10000",
    "http://localhost:10000",
    "http://192.168.48.255:10000",
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://your-app.vercel.app",
]

# Allow optional extra trusted origins from environment variable:
# TRUSTED_ORIGINS="https://example.com,https://app.example.com"
env_origins = os.environ.get("TRUSTED_ORIGINS", "")
if env_origins.strip():
    trusted_origins.extend(
        [origin.strip() for origin in env_origins.split(",") if origin.strip()]
    )

CORS(
    app,
    resources={r"/*": {"origins": trusted_origins}},
    supports_credentials=False,
)

# Host header allow-list (Flask/Werkzeug trusted hosts).
app.config["TRUSTED_HOSTS"] = list(
    {
        urlparse(origin).hostname
        for origin in trusted_origins
        if urlparse(origin).hostname
    }
)

@app.after_request
def add_no_cache_headers(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


def play_audio_locally(filepath):
    """Play generated audio on the server machine without blocking requests."""
    if not filepath:
        return
    if not os.path.exists(filepath):
        return
    try:
        playsound(filepath, block=False)
    except Exception as e:
        print("Local audio playback error:", e)

# -----------------------------
# Translator
# -----------------------------
translator = Translator()

# -----------------------------
# Download models if missing
# -----------------------------
import urllib.request

model_url = os.environ.get("MODEL_URL")
if model_url and not os.path.exists(MODEL_PATH):
    try:
        print("Downloading sign_language_model.pkl...")
        dl_url = model_url if model_url.endswith(".pkl") else model_url.rstrip("/") + "/sign_language_model.pkl"
        urllib.request.urlretrieve(dl_url, MODEL_PATH)
    except Exception as e:
        print(f"Failed to download model: {e}")

if model_url and not os.path.exists(DICTIONARY_PATH):
    try:
        print("Downloading word_dictionary.pkl...")
        dl_url = model_url.replace("sign_language_model.pkl", "word_dictionary.pkl") if model_url.endswith(".pkl") else model_url.rstrip("/") + "/word_dictionary.pkl"
        urllib.request.urlretrieve(dl_url, DICTIONARY_PATH)
    except Exception as e:
        print(f"Failed to download dictionary: {e}")

# -----------------------------
# Load model and dictionary
# -----------------------------
try:
    model = joblib.load(MODEL_PATH)
    word_dict = joblib.load(DICTIONARY_PATH)
    inverted_word_dict = {v: k for k, v in word_dict.items()}
    print("Model and dictionary loaded successfully.")
except Exception as e:
    model = None
    inverted_word_dict = {}
    print("Error loading model or dictionary:", e)

# -----------------------------
# Mediapipe Hand detection
# -----------------------------
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# -----------------------------
# Session state (in-memory)
# Buffer config constants
# -----------------------------
BUFFER_SIZE = 10          # rolling window of last N raw predictions
COMMIT_THRESHOLD = 7      # min votes in window to commit a word
WORD_GAP_SECONDS = 1.5   # no-hand gap → word boundary (reset buffer)
SENTENCE_END_SECONDS = 4.0  # no-hand gap → sentence finalised

# sessions dict: keyed by session_id string
# Each value is a dict with: prediction_buffer, committed_words,
#   last_commit_time, last_hand_seen_time, finalized
sessions: dict = {}
sessions_lock = threading.Lock()


def _get_session(session_id: str) -> dict:
    """Return existing session state or create a fresh one."""
    with sessions_lock:
        if session_id not in sessions:
            sessions[session_id] = {
                "prediction_buffer": deque(maxlen=BUFFER_SIZE),
                "committed_words": [],
                "last_commit_time": time.time(),
                "last_hand_seen_time": time.time(),
                "finalized": False,
            }
        return sessions[session_id]


def _reset_session(session_id: str) -> None:
    """Wipe and re-initialise a session."""
    with sessions_lock:
        sessions[session_id] = {
            "prediction_buffer": deque(maxlen=BUFFER_SIZE),
            "committed_words": [],
            "last_commit_time": time.time(),
            "last_hand_seen_time": time.time(),
            "finalized": False,
        }


# -----------------------------
# ROUTES
# -----------------------------
@app.route("/")
def index_page():
    return render_template("index.html")

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})


@app.route("/home")
@app.route("/index")
@app.route("/index.html")
def home_alias():
    return redirect(url_for("index_page"))

@app.route("/mute")
def mute():
    return render_template("mute.html")

@app.route("/both")
def both_page():
    return render_template("both.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/deaf")
def deaf_page():
    return render_template("deaf.html")

@app.route("/morefeatures")
def morefeatures_page():
    return render_template("morefeatures.html")


@app.route("/signing-portable/")
def signing_portable_index():
    return send_from_directory(SIGNING_PORTABLE_DIR, "index.html")


@app.route("/signing-portable/<path:filename>")
def signing_portable_files(filename):
    return send_from_directory(SIGNING_PORTABLE_DIR, filename)

@app.route("/stt_test")
def stt_test_page():
    return render_template("stt_test.html")

@app.route("/api/dataset_summary")
def dataset_summary():
    words = sorted(
        [str(word) for word in inverted_word_dict.values() if word is not None]
    )
    return jsonify({
        "model_loaded": bool(model),
        "word_count": len(words),
        "supported_words": words
    })

# -----------------------------
# SIGN → TEXT  (upgraded)
# -----------------------------
@app.route("/sign_to_text", methods=["POST"])
def sign_to_text():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    if "frame" not in request.files:
        return jsonify({"error": "No frame uploaded"}), 400

    # ── session id ─────────────────────────────────────────────────
    session_id = request.form.get("session_id", "default")
    session = _get_session(session_id)

    now = time.time()

    # ── decode frame ───────────────────────────────────────────────
    file = request.files["frame"]
    file_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"error": "Invalid image"}), 400

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    hand_detected = bool(results.multi_hand_landmarks)

    # ── gap / boundary detection ────────────────────────────────────
    if not hand_detected:
        time_since_hand = now - session["last_hand_seen_time"]

        if time_since_hand >= SENTENCE_END_SECONDS and not session["finalized"]:
            # Sentence end — finalise if we have words
            if session["committed_words"]:
                session["finalized"] = True
            # Reset buffer so we can detect a new sign if user continues
            session["prediction_buffer"].clear()

        elif time_since_hand >= WORD_GAP_SECONDS:
            # Word boundary — just reset the buffer
            session["prediction_buffer"].clear()

        committed = list(session["committed_words"])
        sentence = " ".join(committed)
        return jsonify({
            "current_prediction": None,
            "committed_words": committed,
            "sentence": sentence,
            "finalized": session["finalized"],
            "hand_detected": False,
        })

    # ── hand visible: update timestamp ─────────────────────────────
    session["last_hand_seen_time"] = now

    # If we were finalized but the user starts signing again, auto-clear
    if session["finalized"]:
        _reset_session(session_id)
        session = _get_session(session_id)
        session["last_hand_seen_time"] = now

    # ── run classifier on first detected hand ──────────────────────
    predicted_word = None
    for hand_landmarks in results.multi_hand_landmarks:
        landmarks = []
        for lm in hand_landmarks.landmark:
            landmarks.extend([lm.x, lm.y, lm.z])

        if len(landmarks) == 63:
            prediction = model.predict([landmarks])
            predicted_word = inverted_word_dict.get(prediction[0], "Unknown")
        break  # use only the first detected hand

    current_prediction = predicted_word

    # ── stability / majority-vote buffer ──────────────────────────
    if predicted_word:
        buf = session["prediction_buffer"]
        buf.append(predicted_word)

        # Count votes for each label in the current window
        vote_counts: dict = {}
        for w in buf:
            vote_counts[w] = vote_counts.get(w, 0) + 1

        top_word = max(vote_counts, key=vote_counts.get)
        top_votes = vote_counts[top_word]

        # Commit only when the window is full and threshold is met
        if len(buf) == BUFFER_SIZE and top_votes >= COMMIT_THRESHOLD:
            last_committed = session["committed_words"][-1] if session["committed_words"] else None
            # Duplicate suppression: don't commit the same word twice in a row
            if top_word != last_committed:
                session["committed_words"].append(top_word)
                session["last_commit_time"] = now
            # Always reset buffer after a commit decision (word accepted or suppressed)
            buf.clear()

    committed = list(session["committed_words"])
    sentence = " ".join(committed)

    return jsonify({
        "current_prediction": current_prediction,
        "committed_words": committed,
        "sentence": sentence,
        "finalized": session["finalized"],
        "hand_detected": True,
    })


# ── Force-commit current top prediction ────────────────────────────────────
@app.route("/commit_word", methods=["POST"])
def commit_word():
    """
    Manually commit whichever word has the most votes in the current buffer.
    Body: { "session_id": "..." }
    """
    data = request.json or {}
    session_id = data.get("session_id", "default")
    session = _get_session(session_id)

    buf = session["prediction_buffer"]
    committed = False
    word_committed = None

    if buf:
        vote_counts: dict = {}
        for w in buf:
            vote_counts[w] = vote_counts.get(w, 0) + 1
        top_word = max(vote_counts, key=vote_counts.get)
        last_committed = session["committed_words"][-1] if session["committed_words"] else None
        if top_word != last_committed:
            session["committed_words"].append(top_word)
            session["last_commit_time"] = time.time()
            word_committed = top_word
            committed = True
        buf.clear()

    committed_list = list(session["committed_words"])
    return jsonify({
        "committed": committed,
        "word_committed": word_committed,
        "committed_words": committed_list,
        "sentence": " ".join(committed_list),
        "finalized": session["finalized"],
    })


# ── Get current sentence state ──────────────────────────────────────────────
@app.route("/get_sentence", methods=["GET"])
def get_sentence():
    """
    GET /get_sentence?session_id=<id>
    Returns { "words": [...], "sentence": "...", "finalized": bool }
    """
    session_id = request.args.get("session_id", "default")
    session = _get_session(session_id)
    committed = list(session["committed_words"])
    return jsonify({
        "words": committed,
        "sentence": " ".join(committed),
        "finalized": session["finalized"],
    })


# ── Clear / reset a session ─────────────────────────────────────────────────
@app.route("/clear_sentence", methods=["POST"])
def clear_sentence():
    """
    POST /clear_sentence  Body: { "session_id": "..." }
    Resets the full session state for a fresh sentence.
    """
    data = request.json or {}
    session_id = data.get("session_id", "default")
    _reset_session(session_id)
    return jsonify({"status": "cleared", "session_id": session_id})


# =====================================================
# TEXT → TRANSLATE → VOICE
# =====================================================
@app.route("/deaf_text_to_voice", methods=["POST"])
def deaf_text_to_voice():
    data = request.json

    text = data.get("text", "").strip()
    language = data.get("language", "en")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if language not in ["en", "hi", "mr"]:
        language = "en"

    # Translate text
    try:
        translated_text = translator.translate(text, dest=language).text
    except Exception as e:
        print("Translation error:", e)
        translated_text = text

    # Generate voice file
    speech_error = None
    try:
        os.makedirs(STATIC_DIR, exist_ok=True)
        filename = os.path.join(STATIC_DIR, f"voice_{int(time.time())}.mp3")
        tts = gTTS(text=translated_text, lang=language, slow=False)
        tts.save(filename)
    except Exception as e:
        print("Speech error:", e)
        speech_error = str(e)
        filename = None

    audio_url = None
    if filename:
        # Use a relative URL so it always matches the currently open domain/scheme/port.
        audio_url = url_for("static", filename=os.path.basename(filename), _external=False)
        # Also play sound on local machine running Flask.
        threading.Thread(
            target=play_audio_locally,
            args=(filename,),
            daemon=True
        ).start()
    else:
        return jsonify({
            "error": "Audio generation failed on server",
            "details": speech_error,
            "original": text,
            "translated": translated_text,
        }), 500

    return jsonify({
        "original": text,
        "translated": translated_text,
        "audio": filename,
        "audio_url": audio_url,
    })


# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    # Safer default: listen only on localhost.
    host = os.environ.get("HOST", "127.0.0.1")
    app.run(host=host, port=port)