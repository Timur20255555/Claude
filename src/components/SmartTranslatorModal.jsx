import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  BookmarkPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../context/useLanguage";
import { speakWord, playClick } from "../utils/sound";
import { WORD_BANK } from "../data/words";

// Comprehensive built-in dictionary for fast local smart translation
const TRANSLATOR_DICT = [
  ...WORD_BANK,
  { en: "Hello", ru: "Привет / Здравствуйте", uz: "Salom / Assalomu alaykum", ko: "안녕하세요", ipa: "/həˈloʊ/" },
  { en: "How are you?", ru: "Как дела?", uz: "Qalaysiz? / Ishlar qalay?", ko: "잘 지내세요?", ipa: "/haʊ ɑːr juː/" },
  { en: "Thank you", ru: "Спасибо", uz: "Rahmat / Tashakkur", ko: "감사합니다", ipa: "/θæŋk juː/" },
  { en: "Good morning", ru: "Доброе утро", uz: "Xayrli tong", ko: "좋은 아침이에요", ipa: "/ɡʊd ˈmɔːr.nɪŋ/" },
  { en: "Good night", ru: "Спокойной ночи", uz: "Xayrli tun", ko: "좋은 밤 보내세요", ipa: "/ɡʊd naɪt/" },
  { en: "Please", ru: "Пожалуйста", uz: "Iltimos", ko: "부탁합니다", ipa: "/pliːz/" },
  { en: "Yes", ru: "Да", uz: "Ha", ko: "네", ipa: "/jes/" },
  { en: "No", ru: "Нет", uz: "Yo'q", ko: "아니요", ipa: "/noʊ/" },
  { en: "I love learning English", ru: "Я люблю учить английский", uz: "Men ingliz tilini o'rganishni yaxshi ko'raman", ko: "나는 영어 배우는 것을 좋아해요", ipa: "/aɪ lʌv ˈlɜːrnɪŋ ˈɪŋɡlɪʃ/" },
  { en: "Knowledge is power", ru: "Знание — сила", uz: "Bilim — bu qudrat", ko: "지식은 힘이다", ipa: "/ˈnɑːlɪdʒ ɪz ˈpaʊər/" },
  { en: "Never give up", ru: "Никогда не сдавайся", uz: "Hech qachon taslim bo'lma", ko: "절대 포기하지 마세요", ipa: "/ˈnev.ər ɡɪv ʌp/" },
  { en: "Success", ru: "Успех", uz: "Muvaffaqiyat", ko: "성공", ipa: "/səkˈses/" },
  { en: "Dream", ru: "Мечта / Сон", uz: "Orzu / Tush", ko: "꿈", ipa: "/driːm/" },
  { en: "Goal", ru: "Цель", uz: "Maqsad", ko: "목표", ipa: "/ɡoʊl/" },
];

export default function SmartTranslatorModal({ isOpen, onClose, onAddToVault }) {
  const { lang, t } = useLanguage();
  const [sourceLang, setSourceLang] = useState("uz");
  const [targetLang, setTargetLang] = useState("en");
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Translation calculation
  const translationResult = useMemo(() => {
    const raw = inputText.trim();
    if (!raw) return null;

    const query = raw.toLowerCase();

    // 1. Direct match in dictionary
    const exact = TRANSLATOR_DICT.find((item) => {
      const sVal = item[sourceLang]?.toLowerCase();
      const enVal = item.en?.toLowerCase();
      const ruVal = item.ru?.toLowerCase();
      const uzVal = item.uz?.toLowerCase();
      return (
        sVal === query ||
        enVal === query ||
        ruVal === query ||
        uzVal === query ||
        (sVal && query.includes(sVal))
      );
    });

    if (exact) {
      return {
        text: exact[targetLang] || exact.en || exact.uz || exact.ru,
        ipa: exact.ipa || "",
        matchedWord: exact,
      };
    }

    // 2. Word by word smart match
    const words = query.split(/\s+/);
    const translatedWords = words.map((w) => {
      const cleanW = w.replace(/[.,!?;:]/g, "");
      const match = TRANSLATOR_DICT.find(
        (item) =>
          item[sourceLang]?.toLowerCase().includes(cleanW) ||
          item.en?.toLowerCase() === cleanW ||
          item.ru?.toLowerCase().includes(cleanW) ||
          item.uz?.toLowerCase().includes(cleanW)
      );
      return match ? match[targetLang] || match.en : w;
    });

    return {
      text: translatedWords.join(" "),
      ipa: "",
      matchedWord: null,
    };
  }, [inputText, sourceLang, targetLang]);

  function handleSwap() {
    playClick();
    const oldSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(oldSource);
    if (translationResult?.text) {
      setInputText(translationResult.text);
    }
  }

  function handleCopy() {
    if (!translationResult?.text) return;
    playClick();
    navigator.clipboard.writeText(translationResult.text);
    setCopied(true);
    toast.success(t("copySuccess"));
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveToVault() {
    if (!inputText.trim() || !translationResult?.text) return;
    playClick();

    const newWord = {
      en: targetLang === "en" ? translationResult.text : inputText,
      uz: sourceLang === "uz" ? inputText : translationResult.text,
      ru: sourceLang === "ru" ? inputText : translationResult.text,
      ko: targetLang === "ko" ? translationResult.text : "",
      ipa: translationResult.ipa || "/.../",
      category: "custom",
      exampleEn: targetLang === "en" ? translationResult.text : inputText,
      exampleUz: sourceLang === "uz" ? inputText : translationResult.text,
      exampleRu: sourceLang === "ru" ? inputText : translationResult.text,
    };

    if (onAddToVault) {
      onAddToVault(newWord);
    }

    setSaved(true);
    toast.success(t("addedToVaultSuccess"));
    setTimeout(() => setSaved(false), 2500);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-cyan-950/50 p-6 z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                  {t("translatorModalTitle")}
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    AI Fast
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {t("translatorModalSubtitle")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Switch Controls */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            {/* Source Lang Select */}
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option value="uz">🇺🇿 O'zbekcha</option>
              <option value="en">🇬🇧 English</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="ko">🇰🇷 한국어</option>
            </select>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-xl bg-slate-700 hover:bg-cyan-500 hover:text-white text-cyan-300 transition-all cursor-pointer shadow-sm"
              title="Tilni almashtirish"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Target Lang Select */}
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option value="en">🇬🇧 English</option>
              <option value="uz">🇺🇿 O'zbekcha</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="ko">🇰🇷 한국어</option>
            </select>
          </div>

          {/* Input Box */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t("typeTextPlaceholder")}
              rows={3}
              className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/60"
              >
                {t("clearText")}
              </button>
            )}
          </div>

          {/* Translation Result Card */}
          {translationResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-850 border border-cyan-500/30 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black text-cyan-300 font-heading">
                      {translationResult.text}
                    </span>
                    {translationResult.ipa && (
                      <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                        {translationResult.ipa}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Pronounce target */}
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      speakWord(
                        targetLang === "en"
                          ? translationResult.text
                          : inputText
                      );
                    }}
                    title={t("listenPronounce")}
                    className="p-2 rounded-xl bg-slate-700/70 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-700/70 text-slate-300 hover:bg-slate-600 hover:text-white transition-all cursor-pointer"
                    title="Nusxalash"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Save to Vault Button */}
                  <button
                    type="button"
                    onClick={handleSaveToVault}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{saved ? "Saqlandi!" : t("addToMyVault")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Words Shortcut Pills */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-2">
              {t("quickWordsTitle")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Hello",
                "Thank you",
                "How are you?",
                "Good morning",
                "I love learning English",
                "Success",
                "Never give up",
              ].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSourceLang("en");
                    setTargetLang(lang === "en" ? "uz" : lang);
                    setInputText(phrase);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs font-medium transition-all cursor-pointer"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
