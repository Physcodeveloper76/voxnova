import { useDatasetSummary } from "@/hooks/useDatasetSummary";
import StatusBadge from "./StatusBadge";
import { Database, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function DatasetPanel() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useDatasetSummary();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">{t("dataset_loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-card p-6">
        <p className="text-sm text-destructive">{t("dataset_error")}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">{t("dataset_title")}</h3>
        </div>
        <StatusBadge loaded={data.model_loaded} />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{data.word_count}</span> {t("dataset_signs")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {data.supported_words.map((word) => (
          <span
            key={word}
            className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
