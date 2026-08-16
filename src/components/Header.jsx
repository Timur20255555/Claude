import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  BookOpen,
  Languages,
  ChevronDown,
  Flame,
  Zap,
  LogOut,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { isSoundEnabled, toggleSound, playClick } from "../utils/sound";
import { getRank } from "../hooks/usePlayerProfile";

export default function Header({ profile, onOpenVault, onOpenTranslator, onOpenProfile, onOpenFriends, onLogout }) {
  const { lang, setLang, t, languages } = useLanguage();
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [langOpen, setLangOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const langRef = useRef(null);

  const currentLang = (languages && languages[lang]) || { label: "UZ", name: "O'zbekcha", flag: "🇺🇿" };
  const rank = getRank(profile?.level || 1, lang);
  const xpPct = Math.min(
    100,
    Math.round(((profile?.xpIntoLevel || 0) / (profile?.xpGoal || 100)) * 100)
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSoundToggle() {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClick();
  }

  function handleConfirmLogout() {
    playClick();
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-xl shadow-black/40">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/25">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white">
                  Lingo<span className="text-cyan-400">Quest</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Center: Profile Widget */}
          {profile && (profile.name || profile.xp > 0) && (
            <button
              type="button"
              onClick={() => {
                playClick();
                if (onOpenProfile) onOpenProfile();
              }}
              title="Profilni ko'rish va o'zgartirish (Click to edit profile)"
              className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/40 transition-all cursor-pointer text-left group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {profile.avatar || "🦉"}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">
                    {profile.name || "Explorer"}
                  </span>
                  {profile.authProvider === "google" && (
                    <span className="text-[9px] font-black text-white px-1 py-px rounded bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 shrink-0">
                      G
                    </span>
                  )}
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    Lv.{profile.level || 1} · {rank.title}
                  </span>
                </div>
                {/* Mini XP Bar */}
                <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-slate-700 text-amber-400 font-bold text-xs">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{profile.streak || 1}d</span>
              </div>
            </button>
          )}

          {/* Right: Actions (Translator, Vault, Friends, Sound, Language, Mobile Logout) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Friends Leaderboard Button */}
            <button
              type="button"
              onClick={() => {
                playClick();
                if (onOpenFriends) onOpenFriends();
              }}
              title={t("friendsTitle")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("friendsTitle")}</span>
            </button>

            {/* Translator Button */}
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenTranslator();
              }}
              title={t("translatorTitle")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t("translatorTitle")}</span>
            </button>

            {/* Vocabulary Vault Button */}
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenVault();
              }}
              title={t("vaultTitle")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer hover:border-cyan-500/40"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t("vaultTitle")}</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleSoundToggle}
              title={soundOn ? t("soundOn") : t("soundOff")}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setLangOpen((o) => !o);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-2xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl p-1.5 z-50"
                  >
                    {Object.values(languages).map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          playClick();
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          l.code === lang
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
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

            {/* Mobile Logout Button (Visible only on smaller screens if user is logged in) */}
            {profile && profile.name && (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowLogoutConfirm(true);
                }}
                title={t("logoutBtn")}
                className="md:hidden p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-center z-10 space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100">
                  {t("logoutConfirmTitle")}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t("logoutConfirmDesc")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  {t("cancelBtn")}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
                >
                  {t("confirmLogoutBtn")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
