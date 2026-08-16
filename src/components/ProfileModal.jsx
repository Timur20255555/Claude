import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  X,
  Flame,
  Trophy,
  Target,
  Gamepad2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../context/useLanguage";
import { getRank } from "../hooks/usePlayerProfile";
import { playClick, playCorrect } from "../utils/sound";

const AVATAR_OPTIONS = [
  { icon: "🦉", name: "Duo Owl" },
  { icon: "⚡", name: "Cyber Bolt" },
  { icon: "🚀", name: "Rocket" },
  { icon: "🦁", name: "Lion" },
  { icon: "🦊", name: "Fox" },
  { icon: "🐼", name: "Panda" },
  { icon: "👑", name: "King" },
  { icon: "🐱", name: "Cyber Cat" },
  { icon: "🐶", name: "Doggy" },
];

const ACHIEVEMENTS_LIST = [
  { id: "welcome", titleUz: "Birinchi Qadam", titleRu: "Первый шаг", titleEn: "First Step", descUz: "LingoQuest olamiga xush kelibsiz", descRu: "Добро пожаловать в LingoQuest", descEn: "Welcome to the LingoQuest world", icon: "🌱" },
  { id: "streak3", titleUz: "Olovli Ishtiyoq", titleRu: "Огненный запал", titleEn: "Flame Keeper", descUz: "3 kunlik uzluksiz seriyaga erishing", descRu: "Достигните серии в 3 дня", descEn: "Reach a 3-day streak", icon: "🔥" },
  { id: "words20", titleUz: "So'z Jamlovchi", titleRu: "Словолов", titleEn: "Vocabulary Scout", descUz: "20 ta so'zni muvaffaqiyatli yodlang", descRu: "Выучите 20 слов", descEn: "Successfully learn 20 words", icon: "📚" },
  { id: "perfect", titleUz: "Benuqson G'alaba", titleRu: "Безупречная победа", titleEn: "Flawless", descUz: "100% aniqlik bilan raundni yakunlang", descRu: "Завершите раунд со 100% точностью", descEn: "Finish a round with 100% accuracy", icon: "🎯" },
  { id: "level5", titleUz: "Lingo Ustasi", titleRu: "Мастер Lingo", titleEn: "Master Rank", descUz: "5-darajaga muvaffaqiyatli yetib boring", descRu: "Достигните 5-го уровня", descEn: "Reach level 5", icon: "👑" },
];

export default function ProfileModal({ isOpen, onClose, profile, onLogout }) {
  const { lang, setLang, t, languages } = useLanguage();
  const [editingName, setEditingName] = useState(profile?.name || "");
  const [editingAvatar, setEditingAvatar] = useState(profile?.avatar || "🦉");
  const [activeTab, setActiveTab] = useState("stats"); // stats | edit | achievements

  if (!isOpen) return null;

  const rank = getRank(profile?.level || 1, lang);
  const xpPct = Math.min(
    100,
    Math.round(((profile?.xpIntoLevel || 0) / (profile?.xpGoal || 100)) * 100)
  );

  const accuracy =
    profile?.gamesPlayed > 0 && profile?.totalCorrect > 0
      ? Math.min(100, Math.round((profile.totalCorrect / (profile.gamesPlayed * 10)) * 100))
      : 85;

  const personaLabel = {
    school: "🎒",
    student: "🎓",
    adult: "💼",
    tourist: "✈️",
  }[profile?.persona || "student"];

  async function handleSaveProfile(e) {
    e?.preventDefault();
    if (!editingName.trim()) return;

    playCorrect();
    if (profile?.updateUser) {
      await profile.updateUser({
        name: editingName.trim(),
        avatar: editingAvatar,
      });
    }

    toast.success(lang === "uz" ? "Profil yangilandi! 🌟" : lang === "ru" ? "Профиль обновлен! 🌟" : "Profile updated! 🌟");
    setActiveTab("stats");
  }

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
          className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-6 z-10 space-y-5 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
                {profile?.avatar || "🦉"}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                  {profile?.name || "Player"}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Lv.{profile?.level || 1}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {rank.badge} {rank.title} • {profile?.xp || 0} XP
                </p>
                {personaLabel && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {personaLabel}{" "}
                    {t(
                      profile?.persona === "school"
                        ? "personaSchool"
                        : profile?.persona === "adult"
                        ? "personaAdult"
                        : profile?.persona === "tourist"
                        ? "personaTourist"
                        : "personaStudent"
                    )}
                    {profile?.authProvider === "google" && profile.googleEmail
                      ? ` · ${profile.googleEmail}`
                      : ""}
                  </p>
                )}
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

          {/* Navigation Tabs (Stats / Edit Profile / Achievements) */}
          <div className="flex rounded-2xl bg-slate-800/80 p-1 border border-slate-700/60 gap-1">
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab("stats");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("profileStatsTab")}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab("edit");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "edit"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("profileEditTab")}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab("achievements");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "achievements"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t("profileAchievementsTab")}
            </button>
          </div>

          {/* Tab 1: Player Statistics */}
          {activeTab === "stats" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Level Progress */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">
                    {t("level")} {profile?.level || 1} · {t("levelProgressLabel")}
                  </span>
                  <span className="text-cyan-400 font-mono">
                    {profile?.xpIntoLevel || 0} / {profile?.xpGoal || 100} XP
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
                  <Flame className="w-5 h-5 text-amber-400 mx-auto" />
                  <span className="block text-lg font-black text-slate-100 mt-1">
                    {profile?.streak || 1}d
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {t("dailyStreakLabel")}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
                  <Trophy className="w-5 h-5 text-cyan-400 mx-auto" />
                  <span className="block text-lg font-black text-slate-100 mt-1">
                    {profile?.bestScore || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {t("bestScoreLabel")}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
                  <Target className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="block text-lg font-black text-slate-100 mt-1">
                    {accuracy}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {t("accuracyLabel")}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>{t("gamesPlayedLabel")}:</span>
                </div>
                <span className="font-mono text-cyan-300">
                  {profile?.gamesPlayed || 0}
                </span>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Edit Profile */}
          {activeTab === "edit" && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t("avatarLabel")}:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.icon}
                      type="button"
                      onClick={() => {
                        playClick();
                        setEditingAvatar(av.icon);
                      }}
                      className={`h-12 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                        editingAvatar === av.icon
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white scale-105 border-2 border-cyan-300 shadow-lg"
                          : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {av.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t("nameLabel")}:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    maxLength={20}
                    placeholder={t("namePlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-medium outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t("primaryLangLabel")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(languages).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        playClick();
                        setLang(l.code);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        lang === l.code
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                {t("saveProfileBtn")}
              </button>
            </motion.form>
          )}

          {/* Tab 3: Achievements */}
          {activeTab === "achievements" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2.5 max-h-60 overflow-y-auto pr-1"
            >
              {ACHIEVEMENTS_LIST.map((ach) => {
                const title = lang === "ru" ? ach.titleRu : lang === "en" ? ach.titleEn : ach.titleUz;
                const desc =
                  lang === "ru"
                    ? ach.descRu
                    : lang === "en"
                    ? ach.descEn
                    : ach.descUz;
                const isUnlocked = profile?.achievements?.includes(ach.id) || ach.id === "welcome";

                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? "bg-slate-800/70 border-cyan-500/40"
                        : "bg-slate-800/20 border-slate-800 opacity-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                      {ach.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100">
                          {title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {t("unlockedLabel")} ✅
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Footer Actions (Logout) */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
                if (onLogout) onLogout();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 py-1.5 px-3 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("logoutBtn")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              {t("closeBtn")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
