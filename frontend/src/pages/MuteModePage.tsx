import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import CameraCapture from "@/components/CameraCapture";
import DatasetPanel from "@/components/DatasetPanel";
import ErrorBanner from "@/components/ErrorBanner";
import SentenceDisplay from "@/components/SentenceDisplay";
import AudioPlayer from "@/components/AudioPlayer";
import {
  signToText,
  commitWord,
  clearSentence,
  deafTextToVoice,
  resolveAudioUrl,
  type SignToTextResponse,
} from "@/lib/api";
import { useDatasetSummary } from "@/hooks/useDatasetSummary";
import { useLanguage } from "@/hooks/useLanguage";

/** Generate a stable session UUID once per component mount. */
function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function MuteModePage() {
  const { t } = useLanguage();
  const { data: dataset } = useDatasetSummary();
  const modelLoaded = dataset?.model_loaded ?? false;

  // Stable session id — created once when the page mounts
  const sessionIdRef = useRef<string>(generateSessionId());
  const sessionId = sessionIdRef.current;

  // ── Recognition state ─────────────────────────────────────────────────
  const [signState, setSignState] = useState<SignToTextResponse>({
    current_prediction: null,
    committed_words: [],
    sentence: "",
    finalized: false,
    hand_detected: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Audio playback state ──────────────────────────────────────────────
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  // ── Per-frame handler ─────────────────────────────────────────────────
  const handleFrame = useCallback(
    async (blob: Blob) => {
      if (!modelLoaded) return;
      setLoading(true);
      try {
        const result = await signToText(blob, sessionId);
        setSignState(result);
        setError(null);
      } catch (e: any) {
        setError(e.message || "Recognition failed");
      } finally {
        setLoading(false);
      }
    },
    [modelLoaded, sessionId]
  );

  // ── Manual commit ─────────────────────────────────────────────────────
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

  // ── Clear sentence ────────────────────────────────────────────────────
  const handleClear = useCallback(async () => {
    try {
      await clearSentence(sessionId);
      setSignState({
        current_prediction: null,
        committed_words: [],
        sentence: "",
        finalized: false,
        hand_detected: false,
      });
      setAudioUrl(null);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Clear failed");
    }
  }, [sessionId]);

  // ── Speak finalized sentence ──────────────────────────────────────────
  const handleSpeak = useCallback(async () => {
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

  // ── Clean up server session on unmount ────────────────────────────────
  useEffect(() => {
    return () => {
      clearSentence(sessionId).catch(() => {});
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("mute_title")}
          </h1>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {!modelLoaded && (
          <div className="rounded-xl border border-ember-amber/30 bg-ember-amber/5 p-4 text-sm text-ember-amber">
            {t("mute_model_offline")}
          </div>
        )}

        {/* Camera + recognition card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 space-y-5"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">
            {t("mute_sign_title")}
          </h2>

          {/* Camera feed — faster frame capture for smoother buffering */}
          <CameraCapture
            onFrame={handleFrame}
            disabled={!modelLoaded}
            intervalMs={600}
          />

          {/* Sentence builder UI */}
          <SentenceDisplay
            currentPrediction={signState.current_prediction}
            sentence={signState.sentence}
            committedWords={signState.committed_words}
            handDetected={signState.hand_detected}
            finalized={signState.finalized}
            loading={loading}
            onSpeak={handleSpeak}
            onClear={handleClear}
            onCommitWord={handleCommitWord}
          />

          {/* Audio player (shown after Speak is pressed) */}
          {(audioUrl || ttsLoading) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <AudioPlayer audioUrl={ttsLoading ? null : audioUrl} />
            </motion.div>
          )}
        </motion.div>

        <DatasetPanel />
      </div>
    </div>
  );
}
