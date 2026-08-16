import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Flame,
  Check,
  X,
  Zap,
  Volume2,
  Sparkles,
  Shield,
  Clock,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { pickRoundWords, buildOptions, CATEGORIES, localizedLabel } from "../data/words";
import { useLanguage } from "../context/useLanguage";
import DuoCompanion from "./DuoCompanion";
import {
  playCorrect,
  playWrong,
  playCombo,
  playPowerup,
  speakWord,
  playClick,
} from "../utils/sound";

const DIFFICULTY_CONFIG = {
  easy: { time: 8, lives: 4, questions: 8 },
  medium: { time: 6, lives: 3, questions: 10 },
  hard: { time: 4, lives: 2, questions: 12 },
  zen: { time: 0, lives: 5, questions: 15 },
};

export default function GameTrainer({
  difficulty = "medium",
  category = "all",
  onFinish,
}) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const { time: QUESTION_TIME, lives: START_LIVES, questions: TOTAL_QUESTIONS } = config;
  const isZen = difficulty === "zen" || QUESTION_TIME === 0;

  const { lang, t } = useLanguage();
  const [words] = useState(() => pickRoundWords(TOTAL_QUESTIONS, category));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME || 10);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  // Power-ups state (one-time use per game)
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [usedShield, setUsedShield] = useState(false);

  // Round stats collector for detailed results review
  const [roundHistory, setRoundHistory] = useState([]);

  const answeredRef = useRef(false);
  const word = words[index] || words[0];

  const { correct, options } = useMemo(
    () => (word ? buildOptions(word, lang) : { correct: "", options: [] }),
    [word, lang]
  );

  // Reset per question state
  useEffect(() => {
    setHiddenOptions([]);
    answeredRef.current = false;
    if (!isZen) {
      setTimeLeft(QUESTION_TIME);
    }
  }, [index, isZen, QUESTION_TIME]);

  // Main countdown timer
  useEffect(() => {
    if (isZen) return;
    const interval = 100;
    const tick = setInterval(() => {
      setTimeLeft((tVal) => {
        const next = tVal - 0.1;
        if (next <= 0 && !answeredRef.current) {
          clearInterval(tick);
          handleAnswer(null, true);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isZen]);

  const handleAnswer = useCallback(
    (option, isTimeOut = false) => {
      if (answeredRef.current || !word) return;
      answeredRef.current = true;
      setSelected(option);

      const isCorrect = option === correct;
      let nextScore = score;
      let nextCombo = combo;
      let nextLives = lives;
      let nextCorrect = correctCount;
      let protectedByShield = false;

      const timeTaken = isZen ? 0 : Math.max(0.1, Number((QUESTION_TIME - timeLeft).toFixed(1)));

      if (isCorrect) {
        playCorrect();
        const speedBonus = isZen
          ? 5
          : Math.max(0, Math.round((timeLeft / QUESTION_TIME) * 15));
        const comboBonus = combo * 3;
        const earned = 10 + speedBonus + comboBonus;

        nextScore = score + earned;
        nextCombo = combo + 1;
        nextCorrect = correctCount + 1;

        if (nextCombo > maxCombo) setMaxCombo(nextCombo);

        setStatus("correct");
        setScore(nextScore);
        setCombo(nextCombo);
        setCorrectCount(nextCorrect);

        if (nextCombo >= 2) {
          playCombo(nextCombo);
        }

        if (nextCombo >= 3 && nextCombo % 3 === 0) {
          toast.success(`${t("comboMilestone")} x${nextCombo}! 🔥`, {
            description: t("comboSubtitle"),
          });
        }
      } else {
        if (hasShield) {
          // Shield absorbs mistake!
          protectedByShield = true;
          setHasShield(false);
          playPowerup();
          toast.info(t("shieldActive"));
          setStatus("wrong");
        } else {
          playWrong();
          nextLives = lives - 1;
          nextCombo = 0;
          setStatus("wrong");
          setLives(nextLives);
          setCombo(0);

          if (isTimeOut) {
            toast.error(`${t("timeUpToast")} ${correct}`);
          } else {
            toast.error(`${t("wrongToast")} ${correct}`);
          }
        }
      }

      // Record word in history
      const historyItem = {
        word: word.en,
        ipa: word.ipa,
        translation: correct,
        exampleEn: word.exampleEn,
        exampleTrans:
          lang === "ru"
            ? word.exampleRu
            : lang === "en"
            ? word.exampleEn
            : lang === "ko"
            ? word.exampleKo
            : word.exampleUz,
        userAnswer: option || "(Time out)",
        isCorrect,
        protectedByShield,
        timeTaken,
      };
      setRoundHistory((prev) => [...prev, historyItem]);

      // Transition to next question or results
      setTimeout(() => {
        const isLast = index === words.length - 1;
        if (nextLives <= 0) {
          onFinish({
            score: nextScore,
            correct: nextCorrect,
            total: words.length,
            outOfLives: true,
            maxCombo: Math.max(nextCombo, maxCombo),
            history: [...roundHistory, historyItem],
          });
        } else if (isLast) {
          onFinish({
            score: nextScore,
            correct: nextCorrect,
            total: words.length,
            outOfLives: false,
            maxCombo: Math.max(nextCombo, maxCombo),
            history: [...roundHistory, historyItem],
          });
        } else {
          setIndex((i) => i + 1);
          setSelected(null);
          setStatus("idle");
        }
      }, 950);
    },
    [
      word,
      correct,
      score,
      combo,
      lives,
      correctCount,
      maxCombo,
      isZen,
      QUESTION_TIME,
      timeLeft,
      hasShield,
      lang,
      t,
      words.length,
      index,
      roundHistory,
      onFinish,
    ]
  );

  // Keyboard shortcut listener (1, 2, 3, 4, Spacebar)
  useEffect(() => {
    function handleKeyDown(e) {
      if (answeredRef.current) return;

      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        speakWord(word?.en);
        return;
      }

      const keyIndex = ["1", "2", "3", "4"].indexOf(e.key);
      if (keyIndex !== -1 && options[keyIndex]) {
        const opt = options[keyIndex];
        if (!hiddenOptions.includes(opt)) {
          e.preventDefault();
          handleAnswer(opt);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, hiddenOptions, word, handleAnswer]);

  // Power-up: 50:50
  function handleFiftyFifty() {
    if (usedFiftyFifty || answeredRef.current) return;
    playPowerup();
    setUsedFiftyFifty(true);
    const wrongOptions = options.filter((o) => o !== correct);
    const toRemove = wrongOptions.slice(0, 2);
    setHiddenOptions(toRemove);
  }

  // Power-up: +5s Freeze
  function handleFreeze() {
    if (usedFreeze || isZen || answeredRef.current) return;
    playPowerup();
    setUsedFreeze(true);
    setTimeLeft((tVal) => tVal + 5);
    toast.info("+5s added to timer! ⏳");
  }

  // Power-up: Shield
  function handleActivateShield() {
    if (usedShield || hasShield || answeredRef.current) return;
    playPowerup();
    setUsedShield(true);
    setHasShield(true);
    toast.info("Shield activated! Next mistake won't cost a life 🛡️");
  }

  if (!word) return null;

  const timePct = isZen
    ? 100
    : Math.max(0, Math.min(100, (timeLeft / QUESTION_TIME) * 100));

  const timerColor =
    timePct > 50
      ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
      : timePct > 25
      ? "bg-gradient-to-r from-amber-400 to-orange-500"
      : "bg-gradient-to-r from-rose-500 to-red-600 animate-pulse";

  const categoryObj = CATEGORIES.find((c) => c.id === word.category);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 pb-10 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="cyber-glow animate-ambient-1 -top-40 -left-40 w-[450px] h-[450px] bg-cyan-600/20" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -right-40 w-[450px] h-[450px] bg-blue-600/20" />

      <div className="relative w-full max-w-lg z-10 space-y-4">
        {/* Top Game HUD (Lives / Question / Score) */}
        <div className="p-3.5 sm:p-4 rounded-2xl glass-panel flex items-center justify-between gap-3 shadow-lg border border-slate-700/60">
          {/* Lives Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: START_LIVES }).map((_, i) => (
              <motion.div
                key={i}
                animate={
                  i < lives && lives === 1
                    ? { scale: [1, 1.25, 1] }
                    : { scale: 1 }
                }
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    i < lives
                      ? "text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      : "text-slate-700/70"
                  }`}
                />
              </motion.div>
            ))}
            {hasShield && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1 p-1 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300"
                title={t("shieldActive")}
              >
                <Shield className="w-4 h-4 fill-cyan-400" />
              </motion.div>
            )}
          </div>

          {/* Question Index Progress */}
          <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-black font-mono text-slate-300">
            <span className="text-cyan-400">{index + 1}</span> / {words.length}
          </div>

          {/* Current Score Counter */}
          <motion.div
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 font-extrabold text-sm"
          >
            <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            <span>{score}</span>
          </motion.div>
        </div>

        {/* Timer Progress Bar (Hidden in Zen mode) */}
        {!isZen && (
          <div className="w-full h-3 rounded-full bg-slate-800/80 border border-slate-700/50 p-0.5 overflow-hidden shadow-inner">
            <motion.div
              className={`h-full rounded-full ${timerColor} shadow-md`}
              style={{ width: `${timePct}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        )}

        {/* Mega Combo Notification Banner */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center justify-center gap-2 py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs tracking-wider shadow-lg shadow-amber-500/10"
            >
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              <span>
                {combo >= 5 ? "⚡ MEGA STREAK" : "🔥 STREAK"} x{combo} (+
                {combo * 3} XP)
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duolingo-style Duo Owl Mascot Helper */}
        <div className="flex justify-center -mb-2">
          <DuoCompanion currentWord={word} />
        </div>

        {/* Main Word Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: status === "correct" ? [1, 1.03, 1] : 1,
              x: status === "wrong" ? [0, -12, 12, -8, 8, 0] : 0,
            }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel text-center relative overflow-hidden shadow-2xl border border-slate-700/70"
          >
            {/* Category Pill */}
            {categoryObj && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/70 text-[11px] font-semibold text-slate-300 mb-3">
                <span>{categoryObj.icon}</span>
                <span>{localizedLabel(categoryObj, lang)}</span>
              </div>
            )}

            <p className="text-xs font-semibold text-slate-400 mb-2">
              {t("whatIsTranslation")}
            </p>

            {/* Target English Word */}
            <div className="flex items-center justify-center gap-3 my-2">
              <h2 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white">
                {word.en}
              </h2>
              {/* Speaker Pronunciation Button */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  speakWord(word.en);
                }}
                title={t("listenPronounce")}
                className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Phonetic Transcription */}
            {word.ipa && (
              <p className="text-xs font-mono text-cyan-400/80 mt-1">
                {word.ipa}
              </p>
            )}

            {/* 4 Interactive Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {options.map((opt, optIdx) => {
                const isHidden = hiddenOptions.includes(opt);
                const isSelected = selected === opt;
                const isCorrectOpt = opt === correct;
                const revealCorrect = selected !== null && isCorrectOpt;

                let styles =
                  "bg-slate-800/70 border-slate-700/80 text-slate-100 hover:bg-slate-700/80 hover:border-cyan-500/50 hover:shadow-cyan-500/10";

                if (selected !== null) {
                  if (revealCorrect) {
                    styles =
                      "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 font-black";
                  } else if (isSelected && !isCorrectOpt) {
                    styles =
                      "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30 font-black";
                  } else {
                    styles =
                      "bg-slate-800/20 border-slate-800/40 text-slate-600 opacity-40";
                  }
                }

                if (isHidden) {
                  return (
                    <div
                      key={opt}
                      className="rounded-2xl border border-slate-800/40 bg-slate-900/30 py-4 px-4 opacity-20 pointer-events-none"
                    />
                  );
                }

                return (
                  <motion.button
                    key={opt}
                    disabled={selected !== null}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(opt)}
                    className={`relative flex items-center justify-between rounded-2xl border-2 font-bold py-4 px-4 text-sm sm:text-base transition-all cursor-pointer shadow-md ${styles}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-mono text-slate-400">
                        {optIdx + 1}
                      </span>
                      <span className="text-left">{opt}</span>
                    </div>

                    {revealCorrect && <Check className="w-5 h-5 shrink-0" />}
                    {isSelected && !isCorrectOpt && (
                      <X className="w-5 h-5 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Gamified Power-ups Bar */}
        <div className="p-3 rounded-2xl glass-panel flex items-center justify-between gap-2 border border-slate-700/60">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t("powerupsTitle")}:</span>
          </span>

          <div className="flex items-center gap-2">
            {/* 50:50 Power-up */}
            <button
              type="button"
              disabled={usedFiftyFifty || selected !== null}
              onClick={handleFiftyFifty}
              title={t("fiftyFifty")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("fiftyFifty")}</span>
            </button>

            {/* +5s Freeze Power-up */}
            {!isZen && (
              <button
                type="button"
                disabled={usedFreeze || selected !== null}
                onClick={handleFreeze}
                title={t("freezeTime")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t("freezeTime")}</span>
              </button>
            )}

            {/* Shield Power-up */}
            <button
              type="button"
              disabled={usedShield || hasShield || selected !== null}
              onClick={handleActivateShield}
              title={t("shield")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                hasShield
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{t("shield")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
