import { useState } from "react";
import { motion } from "framer-motion";
import {
  Feather,
  Zap,
  Flame,
  Compass,
  Trophy,
  Target,
  ArrowRight,
  Puzzle,
  BookOpen,
  Headphones,
  Gamepad2,
} from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { CATEGORIES, localizedLabel } from "../data/words";
import { playClick } from "../utils/sound";
import { getRank } from "../hooks/usePlayerProfile";
import HeroMascot from "./HeroMascot";

export default function DifficultyScreen({ profile, onSelectMode }) {
  const { lang, t } = useLanguage();
  const [selectedGameMode, setSelectedGameMode] = useState("speed"); // speed | scramble | flashcards | listening
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    profile?.difficulty || "medium"
  );

  const rank = getRank(profile?.level || 1, lang);
  const DAILY_GOAL = 3;
  const dailyDone = Math.min(profile?.dailyRounds || 0, DAILY_GOAL);

  const GAME_MODES = [
    {
      id: "speed",
      title: t("modeSpeed"),
      desc: t("modeSpeedDesc"),
      icon: Zap,
      color: "from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300",
      badge: "Action · 4 Choices",
    },
    {
      id: "scramble",
      title: t("modeScramble"),
      desc: t("modeScrambleDesc"),
      icon: Puzzle,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
      badge: "Puzzle · Letters",
    },
    {
      id: "flashcards",
      title: t("modeFlashcards"),
      desc: t("modeFlashcardsDesc"),
      icon: BookOpen,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
      badge: "Study · 3D Flip",
    },
    {
      id: "listening",
      title: t("modeListening"),
      desc: t("modeListeningDesc"),
      icon: Headphones,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
      badge: "Audio · Listening",
    },
  ];

  const LEVELS = [
    {
      id: "easy",
      label: t("easyName"),
      desc: t("easyDesc"),
      icon: Feather,
      color: "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 border-emerald-500/40 text-emerald-300",
      iconBg: "from-emerald-500 to-teal-500 text-white",
      badge: "8s · 4 ❤️",
    },
    {
      id: "medium",
      label: t("mediumName"),
      desc: t("mediumDesc"),
      icon: Zap,
      color: "from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 border-cyan-500/40 text-cyan-300",
      iconBg: "from-cyan-500 to-blue-600 text-white",
      badge: "6s · 3 ❤️",
      popular: true,
    },
    {
      id: "hard",
      label: t("hardName"),
      desc: t("hardDesc"),
      icon: Flame,
      color: "from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 border-rose-500/40 text-rose-300",
      iconBg: "from-rose-500 to-amber-500 text-white",
      badge: "4s · 2 ❤️",
    },
    {
      id: "zen",
      label: t("zenName"),
      desc: t("zenDesc"),
      icon: Compass,
      color: "from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 border-purple-500/40 text-purple-300",
      iconBg: "from-purple-500 to-pink-500 text-white",
      badge: "∞ ⏱️ · 5 ❤️",
    },
  ];

  function handleStart() {
    playClick();
    if (profile?.updateUser) {
      profile.updateUser({ difficulty: selectedDifficulty });
    }
    onSelectMode(selectedGameMode, selectedDifficulty, selectedCategory);
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-24 pb-12 overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="cyber-glow animate-ambient-1 -top-40 -right-40 w-[450px] h-[450px] bg-cyan-600/25" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -left-40 w-[450px] h-[450px] bg-indigo-600/25" />

      <div className="relative w-full max-w-2xl z-10 space-y-5">
        {/* Hero Mascot & Player Banner Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl glass-panel border border-slate-700/60 shadow-xl">
          <div className="flex items-center gap-3.5">
            <HeroMascot avatar={profile?.avatar || "⚡"} size="small" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-100">
                  {profile?.name || "Explorer"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {rank.badge} {rank.title}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1">
                <span>{t("level")} {profile?.level || 1}</span>
                <span>•</span>
                <span>{profile?.xp || 0} {t("xp")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{profile?.streak || 1} {t("daysSuffix")}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t("recordLabel")}: {profile?.bestScore || 0}</span>
              </div>
            </div>

            {/* Daily goal progress chip */}
            <div
              title={t("dailyGoalLabel")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                dailyDone >= DAILY_GOAL
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800/70 border-slate-700/60 text-slate-300"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("dailyGoalLabel")}:</span>
              <span className="font-mono">
                {dailyDone}/{DAILY_GOAL}
              </span>
              {dailyDone >= DAILY_GOAL && <span>🎉</span>}
            </div>
          </div>
        </div>

        {/* Main Hub Selection Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-5 sm:p-7 rounded-3xl glass-panel space-y-5 shadow-2xl"
        >
          {/* Section 1: Choose Game Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>{t("gameModesTitle")}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GAME_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedGameMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedGameMode(mode.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">
                        {mode.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {mode.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Topic / Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t("chooseTopic")}</span>
              <span className="text-[11px] text-cyan-400 font-semibold">
                {localizedLabel(
                  CATEGORIES.find((c) => c.id === selectedCategory),
                  lang
                )}
              </span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isCatActive = selectedCategory === cat.id;
                const label = localizedLabel(cat, lang);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCatActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                        : "bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Difficulty (Only for Speed Quiz mode) */}
          {selectedGameMode === "speed" && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {t("selectDifficultyTitle")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LEVELS.map((lvl) => {
                  const isLvlActive = selectedDifficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setSelectedDifficulty(lvl.id);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isLvlActive
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <span className="block text-xs font-black text-slate-200">
                        {lvl.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                        {lvl.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start Game Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-base py-4 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer mt-2"
          >
            <span>{t("startTrainingBtn")}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
