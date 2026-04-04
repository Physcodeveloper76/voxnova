import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface StatusBadgeProps {
  loaded: boolean;
  label?: string;
}

export default function StatusBadge({ loaded, label }: StatusBadgeProps) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
        loaded
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-destructive/15 text-destructive border border-destructive/30"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${loaded ? "bg-emerald-400 animate-pulse" : "bg-destructive"}`} />
      {label || (loaded ? t("status_loaded") : t("status_not_loaded"))}
    </motion.div>
  );
}
