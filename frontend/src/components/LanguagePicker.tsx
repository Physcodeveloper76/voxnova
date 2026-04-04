import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/hooks/useLanguage";
import { Language } from "@/lib/i18n";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "हिंदी",  native: "हि" },
  { code: "mr", label: "मराठी",  native: "म"  },
];

export default function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <div className="relative group">
      <div
        aria-label={t("nav_language")}
        title={t("nav_language")}
        className="
          flex h-9 items-center gap-1.5 rounded-lg border border-border
          bg-secondary px-3 text-sm font-semibold text-muted-foreground
          transition-colors group-hover:border-primary/40 group-hover:text-primary
          cursor-default
        "
      >
        <Globe size={14} className="shrink-0" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.code}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="leading-none"
          >
            {current.native}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="absolute top-full right-0 pt-2 w-32 z-50">
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows,opacity] duration-300 ease-in-out opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 shadow-lg rounded-lg">
          <div className="overflow-hidden">
            <div className="bg-background border border-border rounded-lg p-1 flex flex-col gap-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                    language === lang.code ? "text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <Check size={14} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
