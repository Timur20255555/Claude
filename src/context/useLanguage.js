import { useContext } from "react";
import { LanguageContext } from "./context";
import { LANGUAGES } from "../data/translations";

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "uz",
      setLang: () => {},
      t: (k) => k,
      languages: LANGUAGES,
    };
  }
  return ctx;
}
