import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Volume2, X, BookOpen, Sparkles, Star } from "lucide-react";
import { WORD_BANK, CATEGORIES, localizedLabel } from "../data/words";
import { useLanguage } from "../context/useLanguage";
import { speakWord, playClick } from "../utils/sound";

export default function VocabularyVaultModal({ isOpen, onClose, customWords = [] }) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const allWords = useMemo(() => {
    return [...(customWords || []), ...WORD_BANK];
  }, [customWords]);

  const filteredWords = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allWords.filter((word) => {
      const matchCat =
        activeCategory === "all" ||
        word.category === activeCategory ||
        (activeCategory === "custom" && word.category === "custom");
      if (!matchCat) return false;
      if (!q) return true;

      const enMatch = word.en?.toLowerCase().includes(q);
      const ruMatch = word.ru && word.ru.toLowerCase().includes(q);
      const uzMatch = word.uz && word.uz.toLowerCase().includes(q);
      const koMatch = word.ko && word.ko.toLowerCase().includes(q);
      return enMatch || ruMatch || uzMatch || koMatch;
    });
  }, [allWords, search, activeCategory]);

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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-slate-900/95 border border-slate-700/70 shadow-2xl shadow-cyan-950/40 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                  {t("vaultTitle")}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {allWords.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === "uz"
                    ? "So'zlar, talaffuz va amaliy misollar"
                    : lang === "ru"
                    ? "Слова, произношение и примеры"
                    : lang === "ko"
                    ? "단어, 발음과 예문"
                    : "Vocabulary, phonetics & usage examples"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="p-5 space-y-3 bg-slate-950/40 border-b border-slate-800/80">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("vaultSearchPlaceholder")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {customWords.length > 0 && (
                <button
                  onClick={() => {
                    playClick();
                    setActiveCategory("custom");
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === "custom"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-slate-800/60 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>{t("customWordsBadge")} ({customWords.length})</span>
                </button>
              )}

              {CATEGORIES.map((cat) => {
                const label = localizedLabel(cat, lang);
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playClick();
                      setActiveCategory(cat.id);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                        : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filteredWords.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
                <p className="text-sm font-semibold">{t("noWordsFound")}</p>
              </div>
            ) : (
              filteredWords.map((word, idx) => {
                const translation = word[lang] || word.uz || word.ru;
                const exampleTrans =
                  lang === "ru"
                    ? word.exampleRu
                    : lang === "en"
                    ? word.exampleEn
                    : lang === "ko"
                    ? word.exampleKo
                    : word.exampleUz;

                return (
                  <motion.div
                    key={`${word.en}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                    className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg font-black text-slate-100 tracking-tight">
                            {word.en}
                          </span>
                          {word.ipa && (
                            <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
                              {word.ipa}
                            </span>
                          )}
                          {word.category === "custom" && (
                            <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30">
                              Custom
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-bold px-2 py-0.5 rounded-md bg-slate-700/50">
                            → {translation}
                          </span>
                        </div>

                        {word.exampleEn && (
                          <div className="mt-2.5 pl-3 border-l-2 border-cyan-500/40 space-y-1">
                            <p className="text-xs text-slate-300 font-medium italic">
                              "{word.exampleEn}"
                            </p>
                            {exampleTrans && (
                              <p className="text-[11px] text-slate-400">
                                {exampleTrans}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Listen audio button */}
                      <button
                        onClick={() => {
                          playClick();
                          speakWord(word.en);
                        }}
                        title={t("listenPronounce")}
                        className="p-2.5 rounded-xl bg-slate-700/50 border border-slate-600/50 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-colors cursor-pointer"
            >
              {t("closeBtn")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
