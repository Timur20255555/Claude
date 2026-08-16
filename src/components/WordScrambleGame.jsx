import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Delete,
  Lightbulb,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { pickRoundWords } from "../data/words";
import { useLanguage } from "../context/useLanguage";
import {
  playCorrect,
  playWrong,
  playCombo,
  playPowerup,
  speakWord,
  playClick,
} from "../utils/sound";

export default function WordScrambleGame({
  category = "all",
  onFinish,
}) {
  const { lang, t } = useLanguage();
  const [words] = useState(() => pickRoundWords(8, category));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [assembledLetters, setAssembledLetters] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const word = words[currentIndex] || words[0];
  const targetWord = (word?.en || "").toUpperCase();
  const targetTranslation = word ? word[lang] || word.uz || word.ru : "";

  // Initialize scrambled tiles when word changes
  useEffect(() => {
    if (!word) return;
    const letters = targetWord.split("").map((char, i) => ({
      id: `${i}-${char}`,
      char,
      used: false,
    }));
    // Shuffle tiles
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setAssembledLetters([]);
    setIsSuccess(false);
  }, [word, targetWord]);

  const handleTileClick = useCallback(
    (tile) => {
      if (tile.used || isSuccess) return;
      playClick();

      const nextAssembled = [...assembledLetters, tile];
      setAssembledLetters(nextAssembled);
      setAvailableTiles((prev) =>
        prev.map((tItem) =>
          tItem.id === tile.id ? { ...tItem, used: true } : tItem
        )
      );

      // Check if word completed
      if (nextAssembled.length === targetWord.length) {
        const assembledStr = nextAssembled.map((tItem) => tItem.char).join("");
        if (assembledStr === targetWord) {
          // Correct!
          setIsSuccess(true);
          playCorrect();
          speakWord(word.en);
          const nextScore = score + 20 + combo * 5;
          const nextCombo = combo + 1;
          setScore(nextScore);
          setCombo(nextCombo);

          if (nextCombo >= 2) playCombo(nextCombo);

          setTimeout(() => {
            if (currentIndex === words.length - 1) {
              onFinish({
                score: nextScore,
                correct: words.length,
                total: words.length,
                outOfLives: false,
              });
            } else {
              setCurrentIndex((i) => i + 1);
            }
          }, 1200);
        } else {
          // Wrong assembly
          playWrong();
          toast.error(t("wrongToast") + " " + targetWord);
          setCombo(0);
          // Shake and reset after delay
          setTimeout(() => {
            setAssembledLetters([]);
            setAvailableTiles((prev) =>
              prev.map((tItem) => ({ ...tItem, used: false }))
            );
          }, 600);
        }
      }
    },
    [assembledLetters, isSuccess, targetWord, word, score, combo, currentIndex, words.length, onFinish, t]
  );

  function handleBackspace() {
    if (assembledLetters.length === 0 || isSuccess) return;
    playClick();
    const last = assembledLetters[assembledLetters.length - 1];
    setAssembledLetters((prev) => prev.slice(0, -1));
    setAvailableTiles((prev) =>
      prev.map((tItem) =>
        tItem.id === last.id ? { ...tItem, used: false } : tItem
      )
    );
  }

  function handleClear() {
    if (isSuccess) return;
    playClick();
    setAssembledLetters([]);
    setAvailableTiles((prev) =>
      prev.map((tItem) => ({ ...tItem, used: false }))
    );
  }

  function handleHint() {
    if (isSuccess) return;
    playPowerup();
    const nextCharIndex = assembledLetters.length;
    if (nextCharIndex < targetWord.length) {
      const neededChar = targetWord[nextCharIndex];
      const unusedTile = availableTiles.find(
        (tItem) => !tItem.used && tItem.char === neededChar
      );
      if (unusedTile) {
        handleTileClick(unusedTile);
      }
    }
  }

  if (!word) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 pb-10 overflow-hidden select-none">
      {/* Dynamic Background */}
      <div className="cyber-glow animate-ambient-1 -top-40 -left-40 w-[450px] h-[450px] bg-purple-600/25" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -right-40 w-[450px] h-[450px] bg-cyan-600/25" />

      <div className="relative w-full max-w-lg z-10 space-y-4">
        {/* Top HUD */}
        <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center justify-between border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>🧩</span>
              <span>{t("modeScramble")}</span>
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

        {/* Main Scramble Card */}
        <motion.div
          key={word.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel text-center border border-slate-700/70 shadow-2xl space-y-6"
        >
          {/* Target Translation Clue */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("meaningLabel")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-cyan-300 font-heading mt-1">
              "{targetTranslation}"
            </h2>
            {word.exampleUz && (
              <p className="text-xs text-slate-400 italic mt-1.5">
                {lang === "ru"
                  ? word.exampleRu
                  : lang === "en"
                  ? word.exampleEn
                  : lang === "ko"
                  ? word.exampleKo
                  : word.exampleUz}
              </p>
            )}
          </div>

          {/* Assembled Letter Slots */}
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[60px] p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            {targetWord.split("").map((_, i) => {
              const letterObj = assembledLetters[i];
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-11 h-12 rounded-xl flex items-center justify-center text-xl font-black font-mono transition-all ${
                    letterObj
                      ? isSuccess
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border-2 border-emerald-300"
                        : "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md border border-cyan-300/40"
                      : "bg-slate-800/80 border-2 border-dashed border-slate-700 text-slate-600"
                  }`}
                >
                  {letterObj?.char || ""}
                </motion.div>
              );
            })}
          </div>

          {/* Available Shuffled Letter Tiles */}
          <div>
            <p className="text-xs font-bold text-slate-400 mb-3">
              {t("scramblePrompt")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableTiles.map((tile) => (
                <motion.button
                  key={tile.id}
                  type="button"
                  whileHover={!tile.used ? { scale: 1.1 } : {}}
                  whileTap={!tile.used ? { scale: 0.9 } : {}}
                  disabled={tile.used || isSuccess}
                  onClick={() => handleTileClick(tile)}
                  className={`w-12 h-12 rounded-2xl text-lg font-black font-mono flex items-center justify-center transition-all cursor-pointer ${
                    tile.used
                      ? "opacity-20 bg-slate-800 border border-slate-800 text-slate-600 cursor-not-allowed"
                      : "bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-700 text-slate-100 shadow-md shadow-black/30"
                  }`}
                >
                  {tile.char}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Controls (Backspace, Clear, Hint, Speak) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleBackspace}
              disabled={assembledLetters.length === 0 || isSuccess}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Delete className="w-4 h-4" />
              <span>{t("backspaceBtn")}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={assembledLetters.length === 0 || isSuccess}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t("clearBtn")}</span>
            </button>

            <button
              type="button"
              onClick={handleHint}
              disabled={isSuccess || assembledLetters.length >= targetWord.length}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/30 disabled:opacity-30 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{t("hintBtn")}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
