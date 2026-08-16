import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Send,
  RotateCcw,
  Home,
  Flame,
  Star,
  ChevronDown,
  Volume2,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "../context/useLanguage";
import { playVictory, playLevelUp, playClick, speakWord } from "../utils/sound";

export default function ResultsScreen({
  results,
  summary,
  profile,
  onRestart,
  onDifficulty,
  onHome,
}) {
  const { lang, t } = useLanguage();
  const [showReview, setShowReview] = useState(false);

  const {
    score = 0,
    correct = 0,
    total = 10,
    outOfLives = false,
    maxCombo = 0,
    history = [],
  } = results;

  const accuracy = Math.round((correct / total) * 100) || 0;

  useEffect(() => {
    if (!outOfLives && accuracy >= 60) {
      playVictory();
      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"],
        });
      } catch {}
    }

    if (summary?.leveledUp) {
      setTimeout(() => {
        playLevelUp();
      }, 500);
    }
  }, [accuracy, outOfLives, summary]);

  let title = t("practiceCompleteTitle");
  if (outOfLives) {
    title = t("outOfLivesTitle");
  } else if (accuracy === 100) {
    title = t("perfectTitle");
  } else if (accuracy >= 80) {
    title = t("excellentTitle");
  } else if (accuracy >= 50) {
    title = t("goodTitle");
  }

  function handleShareTelegram() {
    playClick();
    const shareText = t("shareMessage", {
      score,
      correct,
      total,
    });
    const url = window.location.origin;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 pb-12 overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="cyber-glow animate-ambient-1 -top-40 -right-40 w-[450px] h-[450px] bg-cyan-600/25" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -left-40 w-[450px] h-[450px] bg-purple-600/25" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 text-center z-10 space-y-6"
      >
        {/* Trophy / Icon Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 14,
            delay: 0.15,
          }}
          className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
            outOfLives
              ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-900/40 text-white"
              : accuracy >= 80
              ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-amber-500/30 text-white"
              : "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/30 text-white"
          }`}
        >
          {outOfLives ? (
            <Flame className="w-10 h-10" />
          ) : accuracy >= 80 ? (
            <Trophy className="w-10 h-10 animate-pulse" />
          ) : (
            <Zap className="w-10 h-10" />
          )}
        </motion.div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-100 tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {profile?.name ? `${profile.name}, ` : ""}
            {lang === "uz"
              ? "Natijalaringiz yangilandi!"
              : lang === "ru"
              ? "Твой прогресс успешно сохранён!"
              : "Your progress has been recorded!"}
          </p>
        </div>

        {/* Performance Metric Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <StatBox
            icon={<Target className="w-5 h-5" />}
            value={`${correct}/${total}`}
            label={t("correctAnswers")}
            color="text-emerald-400"
          />
          <StatBox
            icon={<Zap className="w-5 h-5" />}
            value={`${accuracy}%`}
            label={t("accuracy")}
            color="text-cyan-400"
          />
          <StatBox
            icon={<Star className="w-5 h-5" />}
            value={`+${score}`}
            label={t("scoreEarned")}
            color="text-amber-400"
          />
        </div>

        {/* Milestone & Progression Banners */}
        <div className="space-y-2 text-left">
          {summary?.leveledUp && (
            <Banner
              icon={<Star className="w-4 h-4 text-amber-300" />}
              text={`${t("levelUpTitle")} (Lv.${summary.newLevel})`}
              badge="Level Up"
              color="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300"
            />
          )}
          {summary?.isNewBest && (
            <Banner
              icon={<Trophy className="w-4 h-4 text-cyan-300" />}
              text={t("newBestScore")}
              badge="Highscore"
              color="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300"
            />
          )}
          {maxCombo >= 3 && (
            <Banner
              icon={<Flame className="w-4 h-4 text-orange-400" />}
              text={`Max Streak: x${maxCombo} 🔥`}
              color="bg-slate-800/60 border-slate-700/60 text-slate-300"
            />
          )}
        </div>

        {/* Word Mistakes & Practice Review Accordion */}
        {history && history.length > 0 && (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden text-left">
            <button
              type="button"
              onClick={() => {
                playClick();
                setShowReview((r) => !r);
              }}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t("reviewMistakesBtn")}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  {history.length}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showReview ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="divide-y divide-slate-800 max-h-60 overflow-y-auto p-2"
                >
                  {history.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl hover:bg-slate-850 transition-colors flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {item.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span className="font-bold text-slate-100">
                            {item.word}
                          </span>
                          {item.ipa && (
                            <span className="text-[10px] font-mono text-cyan-400/80">
                              {item.ipa}
                            </span>
                          )}
                          <span className="text-slate-400">→</span>
                          <span className="font-semibold text-cyan-300">
                            {item.translation}
                          </span>
                        </div>
                        {item.exampleEn && (
                          <p className="text-[11px] text-slate-400 italic pl-6 mt-1">
                            "{item.exampleEn}"
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          speakWord(item.word);
                        }}
                        title={t("listenPronounce")}
                        className="p-1.5 rounded-lg bg-slate-700/60 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Restart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClick();
              onRestart();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm sm:text-base py-3.5 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t("retryBtn")}</span>
          </motion.button>

          {/* Share on Telegram Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareTelegram}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-slate-200 hover:text-white hover:bg-slate-700/80 font-bold text-sm py-3 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>{t("shareTelegramBtn")}</span>
          </motion.button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                playClick();
                onDifficulty();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("changeModeBtn")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                onHome();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("homeBtn")}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ icon, value, label, color = "text-cyan-400" }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-3 flex flex-col items-center shadow-inner">
      <div className={color}>{icon}</div>
      <span className="mt-1 font-black text-lg sm:text-xl text-slate-100 font-heading">
        {value}
      </span>
      <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold truncate max-w-full">
        {label}
      </span>
    </div>
  );
}

function Banner({ icon, text, badge, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${color}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase tracking-wider font-extrabold">
          {badge}
        </span>
      )}
    </motion.div>
  );
}
