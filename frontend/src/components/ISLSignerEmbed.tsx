import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type ISLSignerEmbedProps = {
  text?: string;
  className?: string;
};

export default function ISLSignerEmbed({ text = "", className = "" }: ISLSignerEmbedProps) {
  const { t } = useLanguage();

  const src = useMemo(() => {
    const envBase    = (import.meta.env.VITE_API_BASE_URL || "").trim();
    const fallbackBase = `${window.location.protocol}//${window.location.hostname}:10000`;
    const base       = (envBase || fallbackBase).replace(/\/$/, "");
    const query      = text.trim() ? `?text=${encodeURIComponent(text)}` : "";
    return `${base}/signing-portable/${query}`;
  }, [text]);

  const openSigner = () => window.open(src, "_blank", "noopener,noreferrer");

  return (
    <div className={`rounded-xl border border-border bg-card p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-foreground">{t("isl_title")}</h3>
        <button
          type="button"
          onClick={openSigner}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("isl_open_full")}
        </button>
      </div>
      <iframe
        title="ISL signing portable"
        src={src}
        className="h-[420px] w-full rounded-lg border border-border bg-secondary"
      />
      <p className="text-xs text-muted-foreground">{t("isl_hint")}</p>
    </div>
  );
}
