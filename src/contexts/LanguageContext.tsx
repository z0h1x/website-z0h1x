import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type TranslationKey } from "@/i18n/translations";

export type Lang = "ar" | "en";

export { translations };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    const stored = window.localStorage.getItem("lang") as Lang | null;
    return stored === "en" || stored === "ar" ? stored : "ar";
  });

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "ar" ? "en" : "ar"));

  const t: Ctx["t"] = (key, vars) => {
    const entry = translations[key];
    let str = entry ? entry[lang] : (key as string);
    if (vars) {
      for (const k in vars) str = str.replace(`{${k}}`, String(vars[k]));
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};