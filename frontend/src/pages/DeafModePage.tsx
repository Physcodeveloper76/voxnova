import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { deafTextToVoice } from "@/lib/api";
import AudioPlayer from "@/components/AudioPlayer";
import ErrorBanner from "@/components/ErrorBanner";
import ISLSignerEmbed from "@/components/ISLSignerEmbed";
import { useLanguage } from "@/hooks/useLanguage";

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "hi" as const, label: "हिंदी"  },
  { code: "mr" as const, label: "मराठी"  },
];

export default function DeafModePage() {
  const { t } = useLanguage();
  const { transcript, isListening, isSupported, error: sttError, start, stop, reset } =
    useSpeechRecognition();
  const [ttsText, setTtsText]   = useState("");
  const [language, setLanguage] = useState<"en" | "hi" | "mr">("en");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleTTS = async () => {
    const text = ttsText.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deafTextToVoice(text, language);
      setAudioUrl(result.audio_url);
      setTranslated(result.translated);
    } catch (e: any) {
      setError(e.message || "Failed to generate audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("deaf_title")}</h1>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {/* Speech to Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">{t("deaf_stt_title")}</h2>
          {!isSupported ? (
            <p className="text-sm text-destructive">{t("deaf_stt_unsupported")}</p>
          ) : (
            <>
              {sttError && <p className="text-sm text-destructive">{sttError}</p>}
              <div className="min-h-[80px] rounded-lg border border-border bg-secondary p-4 text-sm text-foreground">
                {transcript || <span className="text-muted-foreground">{t("deaf_stt_placeholder")}</span>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={isListening ? stop : start}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    isListening
                      ? "bg-destructive/15 text-destructive border border-destructive/30"
                      : "gradient-ember text-primary-foreground shadow-ember hover:scale-[1.02]"
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? t("deaf_stt_stop") : t("deaf_stt_listen")}
                </button>
                <button onClick={reset} className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("deaf_stt_clear")}
                </button>
                <button
                  onClick={() => setTtsText(transcript)}
                  disabled={!transcript}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {t("deaf_stt_use_input")}
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Text to Speech */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">{t("deaf_tts_title")}</h2>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  language === l.code
                    ? "gradient-ember text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <textarea
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder={t("deaf_tts_placeholder")}
            className="w-full rounded-lg border border-border bg-secondary p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            rows={3}
          />
          {translated && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("deaf_translated")}</span> {translated}
            </p>
          )}
          <button
            onClick={handleTTS}
            disabled={loading || !ttsText.trim()}
            className="flex items-center gap-2 rounded-lg gradient-ember px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-ember transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {t("deaf_convert")}
          </button>
          <AudioPlayer audioUrl={audioUrl} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ISLSignerEmbed text={ttsText || transcript} />
        </motion.div>
      </div>
    </div>
  );
}
