import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  Zap,
  Check,
  X,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { pickRoundWords, buildOptions } from "../data/words";
import { useLanguage } from "../context/useLanguage";
import {
  playCorrect,
  playWrong,
  playCombo,
  speakWord,
  playClick,
} from "../utils/sound";

export default function ListeningChallengeGame({
  category = "all",
  onFinish,
}) {
  const { lang, t } = useLanguage();
  const [words] = useState(() => pickRoundWords(8, category));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);

  const word = words[currentIndex] || words[0];
  const { correct, options } = useMemo(
    () => (word ? buildOptions(word, lang) : { correct: "", options: [] }),
    [word, lang]
  );

  // Automatically speak word when index changes
  useEffect(() => {
    if (!word) return;
    const timer = setTimeout(() => {
      speakWord(word.en);
    }, 400);
    return () => clearTimeout(timer);
  }, [word]);

  function handleOptionSelect(opt) {
    if (selected !== null) return;
    setSelected(opt);

    const isCorrect = opt === correct;
    let nextScore = score;
    let nextCombo = combo;
    let nextCorrect = correctCount;

    if (isCorrect) {
      playCorrect();
      nextScore = score + 15 + combo * 4;
      nextCombo = combo + 1;
      nextCorrect = correctCount + 1;
      setScore(nextScore);
      setCombo(nextCombo);
      setCorrectCount(nextCorrect);
      if (nextCombo >= 2) playCombo(nextCombo);
    } else {
      playWrong();
      setCombo(0);
      toast.error(t("wrongToast") + " " + correct);
    }

    setTimeout(() => {
      if (currentIndex === words.length - 1) {
        onFinish({
          score: nextScore,
          correct: nextCorrect,
          total: words.length,
          outOfLives: false,
        });
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1000);
  }

  if (!word) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 pb-12 overflow-hidden select-none">
      {/* Ambient background */}
      <div className="cyber-glow animate-ambient-1 -top-40 -left-40 w-[450px] h-[450px] bg-cyan-600/25" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -right-40 w-[450px] h-[450px] bg-blue-600/25" />

      <div className="relative w-full max-w-md z-10 space-y-4">
        {/* Top HUD */}
        <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>🎧</span>
              <span>{t("modeListening")}</span>
            </span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-300">
            <span className="text-cyan-400">{currentIndex + 1}</span> / {words.length}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-black">
            <Zap className="w-4 h-4 fill-cyan-400" />
            <span>{score} XP</span>
          </div>
        </div>

        {/* Listening Sound Box */}
        <motion.div
          key={word.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel text-center border border-slate-700/70 shadow-2xl space-y-6"
        >
          <p className="text-xs font-bold text-slate-400">
            {t("listeningPrompt")}
          </p>

          {/* Animated Big Speaker Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playClick();
                speakWord(word.en);
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 text-white cursor-pointer border-2 border-cyan-300/40"
            >
              <Volume2 className="w-12 h-12 animate-pulse" />
            </motion.button>

            <button
              type="button"
              onClick={() => {
                playClick();
                speakWord(word.en);
              }}
              className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              <span>{t("playAgainAudio")}</span>
            </button>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrectOpt = opt === correct;
              const revealCorrect = selected !== null && isCorrectOpt;

              let styles =
                "bg-slate-800/70 border-slate-700/70 text-slate-100 hover:bg-slate-700/80 hover:border-cyan-500/40";

              if (selected !== null) {
                if (revealCorrect) {
                  styles =
                    "bg-emerald-500 border-emerald-400 text-white font-black shadow-lg shadow-emerald-500/30";
                } else if (isSelected && !isCorrectOpt) {
                  styles =
                    "bg-rose-500 border-rose-400 text-white font-black shadow-lg shadow-rose-500/30";
                } else {
                  styles = "bg-slate-800/20 border-slate-800/30 text-slate-600 opacity-40";
                }
              }

              return (
                <motion.button
                  key={opt}
                  disabled={selected !== null}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleOptionSelect(opt)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer shadow-md ${styles}`}
                >
                  <span>{opt}</span>
                  {revealCorrect && <Check className="w-5 h-5 shrink-0" />}
                  {isSelected && !isCorrectOpt && (
                    <X className="w-5 h-5 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
