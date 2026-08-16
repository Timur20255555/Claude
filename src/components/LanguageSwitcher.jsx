import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { playClick } from "../utils/sound";

export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = (languages && languages[lang]) || { label: "UZ", name: "O'zbekcha", flag: "🇺🇿" };

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="fixed top-4 right-4 z-50 select-none">
      <button
        type="button"
        onClick={() => {
          playClick();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl px-3 py-2 text-slate-200 text-xs font-bold shadow-xl shadow-black/40 hover:border-cyan-500/40 transition-colors cursor-pointer"
      >
        <span>{current.flag}</span>
        <span>{current.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && languages && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden p-1.5"
          >
            {Object.values(languages).map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => {
                  playClick();
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  l.code === lang
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {l.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

