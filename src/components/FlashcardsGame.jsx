import { useState } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  Rotate3d,
  CheckCircle2,
  RotateCcw,
  Zap,
} from "lucide-react";
import { pickRoundWords, CATEGORIES } from "../data/words";
import { useLanguage } from "../context/useLanguage";
import { playCorrect, playClick, speakWord } from "../utils/sound";

export default function FlashcardsGame({ category = "all", onFinish }) {
  const { lang, t } = useLanguage();
  const [cards] = useState(() => pickRoundWords(10, category));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [knownCount, setKnownCount] = useState(0);

  const card = cards[currentIndex] || cards[0];
  const translation = card ? card[lang] || card.uz || card.ru : "";
  const exampleTrans =
    lang === "ru" ? card?.exampleRu : lang === "en" ? card?.exampleEn : card?.exampleUz;

  const categoryObj = CATEGORIES.find((c) => c.id === card?.category);

  function handleFlip() {
    playClick();
    setIsFlipped((f) => !f);
  }

  function handleKnown() {
    playCorrect();
    const nextScore = score + 15;
    const nextKnown = knownCount + 1;
    setScore(nextScore);
    setKnownCount(nextKnown);

    advanceCard(nextScore, nextKnown);
  }

  function handleRepeat() {
    playClick();
    advanceCard(score, knownCount);
  }

  function advanceCard(currentScore, currentKnown) {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex === cards.length - 1) {
        onFinish({
          score: currentScore,
          correct: currentKnown,
          total: cards.length,
          outOfLives: false,
        });
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 250);
  }

  if (!card) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 pb-12 overflow-hidden select-none">
      {/* Ambient background */}
      <div className="cyber-glow animate-ambient-1 -top-40 -right-40 w-[450px] h-[450px] bg-blue-600/25" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -left-40 w-[450px] h-[450px] bg-emerald-600/25" />

      <div className="relative w-full max-w-md z-10 space-y-4">
        {/* Top HUD */}
        <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>🃏</span>
              <span>{t("modeFlashcards")}</span>
            </span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-300">
            <span className="text-cyan-400">{currentIndex + 1}</span> / {cards.length}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>{score} XP</span>
          </div>
        </div>

        {/* 3D Flippable Flashcard */}
        <div
          onClick={handleFlip}
          className="relative w-full h-80 sm:h-96 cursor-pointer [perspective:1000px]"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="w-full h-full relative [transform-style:preserve-3d]"
          >
            {/* Front Side: English Word */}
            <div className="absolute inset-0 rounded-3xl glass-panel p-6 sm:p-8 flex flex-col items-center justify-between text-center border-2 border-slate-700/80 shadow-2xl [backface-visibility:hidden]">
              {/* Category */}
              {categoryObj && (
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>{categoryObj.icon}</span>
                  <span>{lang === "ru" ? categoryObj.labelRu : lang === "en" ? categoryObj.labelEn : categoryObj.labelUz}</span>
                </span>
              )}

              {/* Main Word */}
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
                  {card.en}
                </h2>
                {card.ipa && (
                  <p className="text-sm font-mono text-cyan-400/80">
                    {card.ipa}
                  </p>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    speakWord(card.en);
                  }}
                  className="mt-2 p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-md inline-flex items-center gap-2 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t("listenPronounce")}</span>
                </button>
              </div>

              {/* Flip Hint */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Rotate3d className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>{t("flashcardsPrompt")}</span>
              </div>
            </div>

            {/* Back Side: Translation & Example */}
            <div className="absolute inset-0 rounded-3xl bg-slate-900/95 border-2 border-cyan-500/50 p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {lang === "uz" ? "O'zbekcha tarjimasi" : lang === "ru" ? "Русский перевод" : "Translation"}
              </span>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl font-black font-heading text-cyan-300">
                  {translation}
                </h3>

                {card.exampleEn && (
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left space-y-1">
                    <p className="text-xs text-slate-200 font-medium italic">
                      "{card.exampleEn}"
                    </p>
                    {exampleTrans && (
                      <p className="text-[11px] text-slate-400">
                        {exampleTrans}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Rotate3d className="w-4 h-4 text-cyan-400" />
                <span>{t("flipCard")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rating / Navigation Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRepeat}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("cardHard")}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleKnown}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("cardLearned")}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
