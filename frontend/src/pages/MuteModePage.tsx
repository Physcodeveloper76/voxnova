import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CameraCapture from "@/components/CameraCapture";
import DatasetPanel from "@/components/DatasetPanel";
import ErrorBanner from "@/components/ErrorBanner";
import { signToText } from "@/lib/api";
import { useDatasetSummary } from "@/hooks/useDatasetSummary";
import { useLanguage } from "@/hooks/useLanguage";

export default function MuteModePage() {
  const { t } = useLanguage();
  const [word, setWord]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const { data: dataset }   = useDatasetSummary();
  const modelLoaded         = dataset?.model_loaded ?? false;

  const handleFrame = useCallback(async (blob: Blob) => {
    if (!modelLoaded) return;
    setLoading(true);
    try {
      const result = await signToText(blob);
      setWord(result.word);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Recognition failed");
    } finally {
      setLoading(false);
    }
  }, [modelLoaded]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("mute_title")}</h1>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {!modelLoaded && (
          <div className="rounded-xl border border-ember-amber/30 bg-ember-amber/5 p-4 text-sm text-ember-amber">
            {t("mute_model_offline")}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-semibold text-foreground">{t("mute_sign_title")}</h2>
          <CameraCapture onFrame={handleFrame} disabled={!modelLoaded} />

          <div className="rounded-lg border border-border bg-secondary p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {t("mute_recognized_label")}
            </p>
            <div className="flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin text-primary" />}
              <p className="font-display text-3xl font-bold text-gradient-ember">{word || "—"}</p>
            </div>
          </div>
        </motion.div>

        <DatasetPanel />
      </div>
    </div>
  );
}
