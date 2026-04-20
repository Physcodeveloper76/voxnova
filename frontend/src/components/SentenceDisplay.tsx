import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Volume2, RotateCcw } from "lucide-react";

interface SentenceDisplayProps {
  currentPrediction: string | null;
  sentence: string;
  committedWords: string[];
  handDetected: boolean;
  finalized: boolean;
  onSpeak: () => void;
  onClear: () => void;
  onCommitWord: () => void;
  loading?: boolean;
}

export default function SentenceDisplay({
  currentPrediction,
  sentence,
  committedWords,
  handDetected,
  finalized,
  onSpeak,
  onClear,
  onCommitWord,
  loading = false,
}: SentenceDisplayProps) {
  return (
    <div className="space-y-4">
      {/* ── Status bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
              handDetected ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" : "bg-muted-foreground/40"
            }`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {handDetected ? "Hand detected" : "No hand — gap"}
          </span>
        </div>

        {finalized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 rounded-full gradient-wave px-3 py-1 text-xs font-bold text-primary-foreground"
          >
            <CheckCircle2 size={12} />
            Sentence complete
          </motion.div>
        )}
      </div>

      {/* ── Current word being "typed" ──────────────────────────────────── */}
      <div className="rounded-lg border border-border/60 bg-secondary/60 px-4 py-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Current word
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPrediction ?? "__none__"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="font-display text-xl font-semibold text-muted-foreground"
          >
            {currentPrediction ?? (loading ? "…" : "—")}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Sentence so far ────────────────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          layout
          className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-500 ${
            finalized
              ? "border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_24px_4px_rgba(52,211,153,0.12)]"
              : "border-border bg-secondary"
          }`}
        >
          {finalized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(52,211,153,0.04), transparent 60%)",
              }}
            />
          )}
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Sentence
          </p>

          {/* Word chips */}
          {committedWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {committedWords.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    finalized
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "gradient-wave-subtle border border-primary/20 text-primary"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic mb-4">
              Start signing to build your sentence…
            </p>
          )}

          {/* Full sentence text */}
          {sentence && (
            <p
              className={`font-display text-2xl font-bold leading-snug ${
                finalized ? "text-gradient-wave" : "text-foreground"
              }`}
            >
              {sentence}
              {finalized && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="ml-2 text-emerald-400"
                >
                  ✓
                </motion.span>
              )}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Action buttons ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {/* Speak — only shown when finalized */}
        <AnimatePresence>
          {finalized && sentence && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={onSpeak}
              className="flex items-center gap-2 rounded-lg gradient-wave px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-wave hover:scale-[1.02] transition-transform"
            >
              <Volume2 size={15} />
              Speak
            </motion.button>
          )}
        </AnimatePresence>

        {/* Commit Word */}
        <button
          onClick={onCommitWord}
          disabled={!currentPrediction}
          className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Commit Word
        </button>

        {/* Clear Sentence */}
        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>
    </div>
  );
}
