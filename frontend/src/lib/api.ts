const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function apiUrl(path: string) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export async function fetchDatasetSummary() {
  const res = await fetch(apiUrl("/api/dataset_summary"));
  if (!res.ok) throw new Error("Failed to fetch dataset summary");
  return res.json() as Promise<{
    model_loaded: boolean;
    word_count: number;
    supported_words: string[];
  }>;
}

// ── Updated response type for /sign_to_text ─────────────────────────────────
export interface SignToTextResponse {
  /** The raw prediction for the current frame (null when no hand visible). */
  current_prediction: string | null;
  /** All words committed so far in the current sentence. */
  committed_words: string[];
  /** committed_words joined by spaces. */
  sentence: string;
  /** True when a sentence-end gap (4 s) has been detected. */
  finalized: boolean;
  /** Whether MediaPipe found a hand in the frame. */
  hand_detected: boolean;
}

export async function signToText(
  frame: Blob,
  sessionId: string
): Promise<SignToTextResponse> {
  const form = new FormData();
  form.append("frame", frame, "frame.jpg");
  form.append("session_id", sessionId);
  const res = await fetch(apiUrl("/sign_to_text"), { method: "POST", body: form });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as SignToTextResponse;
}

export interface CommitWordResponse {
  committed: boolean;
  word_committed: string | null;
  committed_words: string[];
  sentence: string;
  finalized: boolean;
}

export async function commitWord(sessionId: string): Promise<CommitWordResponse> {
  const res = await fetch(apiUrl("/commit_word"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as CommitWordResponse;
}

export interface GetSentenceResponse {
  words: string[];
  sentence: string;
  finalized: boolean;
}

export async function getSentence(sessionId: string): Promise<GetSentenceResponse> {
  const res = await fetch(apiUrl(`/get_sentence?session_id=${encodeURIComponent(sessionId)}`));
  if (!res.ok) throw new Error("Failed to fetch sentence");
  return res.json() as Promise<GetSentenceResponse>;
}

export async function clearSentence(sessionId: string): Promise<void> {
  await fetch(apiUrl("/clear_sentence"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
}

export async function deafTextToVoice(text: string, language: "en" | "hi" | "mr") {
  const res = await fetch(apiUrl("/deaf_text_to_voice"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as {
    original: string;
    translated: string;
    audio: string;
    audio_url: string;
  };
}

export function resolveAudioUrl(audioUrl: string) {
  if (audioUrl.startsWith("http")) return audioUrl;
  return API_BASE ? `${API_BASE}${audioUrl}` : audioUrl;
}
