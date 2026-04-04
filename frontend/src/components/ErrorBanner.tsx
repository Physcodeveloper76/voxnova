import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const { t } = useLanguage();
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertTriangle size={18} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs underline hover:no-underline">
          {t("error_dismiss")}
        </button>
      )}
    </div>
  );
}
