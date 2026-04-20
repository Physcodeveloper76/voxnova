import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  deafTextToVoice,
  signToText,
  commitWord,
  clearSentence,
  resolveAudioUrl,
  type SignToTextResponse,
} from "@/lib/api";
import { useDatasetSummary } from "@/hooks/useDatasetSummary";
import AudioPlayer from "@/components/AudioPlayer";
import CameraCapture from "@/components/CameraCapture";
import DatasetPanel from "@/components/DatasetPanel";
import ErrorBanner from "@/components/ErrorBanner";
import ISLSignerEmbed from "@/components/ISLSignerEmbed";
import SentenceDisplay from "@/components/SentenceDisplay";
import { useLanguage } from "@/hooks/useLanguage";

const LANGUAGES = [
  { code: "en" as const, label: "EN" },
  { code: "hi" as const, label: "हि" },
  { code: "mr" as const, label: "म"  },
];

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function BothModePage() {
  const { t } = useLanguage();
  const { transcript, isListening, isSupported, error: sttError, start, stop, reset } =
    useSpeechRecognition();
  const [ttsText, setTtsText]     = useState("");
  const [language, setLanguage]   = useState<"en" | "hi" | "mr">("en");
  const [audioUrl, setAudioUrl]   = useState<string | null>(null);
  const [translated, setTranslated] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [signLoading, setSignLoading] = useState(false);
  const { data: dataset }         = useDatasetSummary();
  const modelLoaded               = dataset?.model_loaded ?? false;

  // Sign sentence state
  const sessionIdRef = useRef<string>(generateSessionId());
  const sessionId = sessionIdRef.current;
  const [signState, setSignState] = useState<SignToTextResponse>({
    current_prediction: null,
    committed_words: [],
    sentence: "",
    finalized: false,
    hand_detected: false,
  });

  const handleTTS = async () => {
    const text = ttsText.trim();
    if (!text) return;
    setTtsLoading(true);
    setError(null);
    try {
      const result = await deafTextToVoice(text, language);
      setAudioUrl(resolveAudioUrl(result.audio_url));
      setTranslated(result.translated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleFrame = useCallback(async (blob: Blob) => {
    if (!modelLoaded) return;
    setSignLoading(true);
    try {
      const result = await signToText(blob, sessionId);
      setSignState(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSignLoading(false);
    }
  }, [modelLoaded, sessionId]);

  const handleCommitWord = useCallback(async () => {
    try {
      const result = await commitWord(sessionId);
      setSignState((prev) => ({
        ...prev,
        committed_words: result.committed_words,
        sentence: result.sentence,
        finalized: result.finalized,
      }));
    } catch (e: any) {
      setError(e.message || "Commit failed");
    }
  }, [sessionId]);

  const handleClearSign = useCallback(async () => {
    try {
      await clearSentence(sessionId);
      setSignState({
        current_prediction: null,
        committed_words: [],
        sentence: "",
        finalized: false,
        hand_detected: false,
      });
    } catch (e: any) {
      setError(e.message || "Clear failed");
    }
  }, [sessionId]);

  const handleSpeakSign = useCallback(async () => {
    const text = signState.sentence.trim();
    if (!text) return;
    setTtsLoading(true);
    try {
      const result = await deafTextToVoice(text, "en");
      setAudioUrl(resolveAudioUrl(result.audio_url));
    } catch (e: any) {
      setError(e.message || "Speech failed");
    } finally {
      setTtsLoading(false);
    }
  }, [signState.sentence]);

  useEffect(() => {
    return () => { clearSentence(sessionId).catch(() => {}); };
  }, [sessionId]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-6xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("both_title")}</h1>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: STT + TTS */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-6 space-y-4"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{t("deaf_stt_title")}</h2>
              {!isSupported ? (
                <p className="text-sm text-destructive">{t("both_stt_unsupported")}</p>
              ) : (
                <>
                  {sttError && <p className="text-sm text-destructive">{sttError}</p>}
                  <div className="min-h-[60px] rounded-lg border border-border bg-secondary p-3 text-sm text-foreground">
                    {transcript || <span className="text-muted-foreground">{t("both_stt_placeholder")}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={isListening ? stop : start}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        isListening
                          ? "bg-destructive/15 text-destructive border border-destructive/30"
                          : "gradient-ember text-primary-foreground"
                      }`}
                    >
                      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      {isListening ? t("both_stop") : t("both_listen")}
                    </button>
                    <button onClick={reset} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                      {t("both_clear")}
                    </button>
                    <button
                      onClick={() => setTtsText(transcript)}
                      disabled={!transcript}
                      className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                    >
                      {t("both_to_tts")}
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 space-y-4"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{t("deaf_tts_title")}</h2>
              <div className="flex gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      language === l.code ? "gradient-ember text-primary-foreground" : "border border-border text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder={t("both_tts_placeholder")}
                className="w-full rounded-lg border border-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                rows={2}
              />
              {translated && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{t("both_translated")}</span> {translated}
                </p>
              )}
              <button
                onClick={handleTTS}
                disabled={ttsLoading || !ttsText.trim()}
                className="flex items-center gap-2 rounded-lg gradient-ember px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                {ttsLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {t("both_convert")}
              </button>
              <AudioPlayer audioUrl={audioUrl} />
            </motion.div>
          </div>

          {/* Right: Sign Recognition with sentence builder */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-6 space-y-5"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{t("both_sign_title")}</h2>
              {!modelLoaded && (
                <p className="text-sm text-ember-amber">{t("both_model_offline")}</p>
              )}
              <CameraCapture onFrame={handleFrame} disabled={!modelLoaded} intervalMs={600} />

              <SentenceDisplay
                currentPrediction={signState.current_prediction}
                sentence={signState.sentence}
                committedWords={signState.committed_words}
                handDetected={signState.hand_detected}
                finalized={signState.finalized}
                loading={signLoading}
                onSpeak={handleSpeakSign}
                onClear={handleClearSign}
                onCommitWord={handleCommitWord}
              />
            </motion.div>

            <DatasetPanel />
            <ISLSignerEmbed text={ttsText || transcript || signState.sentence || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
