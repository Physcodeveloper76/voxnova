import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, TranslationKey, translations } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate a key. Optionally interpolate `{year}` etc. */
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
};

// ─── Context ──────────────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "voxnova_language";

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved && ["en", "hi", "mr"].includes(saved) ? saved : "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  /** Translate a key, interpolating optional `{var}` placeholders. */
  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>): string => {
      let str: string = translations[language][key] as string;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
