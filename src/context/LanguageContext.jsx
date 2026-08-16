import { useState } from "react";
import { LanguageContext } from "./context";
import { LANGUAGES, TRANSLATIONS } from "../data/translations";

const STORAGE_KEY = "lingoquest_lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "uz"
  );

  function changeLang(code) {
    setLang(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {}
  }

  function t(key, params = {}) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.uz;
    let text = dict[key] || TRANSLATIONS.uz[key] || TRANSLATIONS.en[key] || key;

    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), params[paramKey]);
    });

    return text;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}
