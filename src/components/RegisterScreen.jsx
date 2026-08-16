import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, ChevronLeft } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { playClick } from "../utils/sound";
import HeroMascot from "./HeroMascot";
import GoogleAccountPicker, { GoogleGLogo } from "./GoogleAccountPicker";

const AVATARS = [
  { icon: "⚡", name: "Cyber Bolt" },
  { icon: "🦉", name: "Wise Owl" },
  { icon: "🚀", name: "Cosmic Rocket" },
  { icon: "🦁", name: "Noble Lion" },
  { icon: "🦊", name: "Mystic Fox" },
  { icon: "🐼", name: "Zen Panda" },
  { icon: "👑", name: "Lingo King" },
];

const PERSONAS = [
  { id: "school", key: "personaSchool" },
  { id: "student", key: "personaStudent" },
  { id: "adult", key: "personaAdult" },
  { id: "tourist", key: "personaTourist" },
];

export default function RegisterScreen({ profile, onNext }) {
  const { lang, setLang, t, languages } = useLanguage();
  const [view, setView] = useState("home"); // home | manual
  const [name, setName] = useState(profile?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || "⚡");
  const [persona, setPersona] = useState(profile?.persona || "student");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  async function handleGoogleSignIn(account) {
    if (signingIn) return;
    setSigningIn(true);
    try {
      playClick();
      if (profile?.signInWithGoogle) {
        await profile.signInWithGoogle(account);
      } else {
        await profile?.updateUser?.({
          name: (account?.name || "Explorer").split(" ")[0].slice(0, 20),
          avatar: account?.avatar || "🦉",
          authProvider: "google",
          googleEmail: account?.email || "",
        });
      }
      // Remember persona chosen on this screen
      await profile?.updateUser?.({ persona });
      setPickerOpen(false);
      onNext();
    } finally {
      setSigningIn(false);
    }
  }

  async function handleManualNext(e) {
    e?.preventDefault();
    if (!name.trim()) return;

    playClick();
    if (profile?.updateUser) {
      await profile.updateUser({
        name: name.trim(),
        avatar: selectedAvatar,
        persona,
        authProvider: "manual",
        lang,
      });
    }
    onNext();
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-24 pb-12 overflow-hidden select-none">
      {/* Dynamic Background Glows */}
      <div className="cyber-glow animate-ambient-1 -top-40 -left-40 w-[450px] h-[450px] bg-cyan-600/30" />
      <div className="cyber-glow animate-ambient-2 -bottom-40 -right-40 w-[450px] h-[450px] bg-blue-600/30" />
      <div className="cyber-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 z-10 space-y-5 shadow-2xl"
      >
        {/* Interactive Animated Hero Mascot */}
        <div className="flex flex-col items-center text-center">
          <HeroMascot avatar={selectedAvatar} mood="excited" />

          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-100 tracking-tight mt-3">
            {t("welcomeTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
            {t("welcomeSubtitle")}
          </p>
        </div>

        {/* ---- Persona picker (who are you?) ---- */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {t("personaLabel")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((p) => {
              const isSelected = persona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setPersona(p.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>{t(p.key).split(" ")[0]}</span>
                  <span className="truncate">{t(p.key).replace(/^\S+\s/, "")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- UI / translation language ---- */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {t("languageSelectLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(languages).map((l) => {
              const isSelected = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    playClick();
                    setLang(l.code);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span className="truncate">{l.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {view === "home" ? (
          /* ---- Google sign-in + manual link ---- */
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => {
                playClick();
                setPickerOpen(true);
              }}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-slate-800 font-bold text-sm py-3.5 shadow-lg shadow-black/30 hover:shadow-xl hover:bg-slate-100 transition-all cursor-pointer"
            >
              <GoogleGLogo className="w-5 h-5" />
              <span>{t("googleSignInBtn")}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-700/60" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t("orDivider")}
              </span>
              <div className="h-px flex-1 bg-slate-700/60" />
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                setView("manual");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-700/70 font-bold text-sm py-3 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{t("manualSignupBtn")}</span>
            </button>
          </div>
        ) : (
          /* ---- Manual registration form ---- */
          <form onSubmit={handleManualNext} className="space-y-4">
            <button
              type="button"
              onClick={() => {
                playClick();
                setView("home");
              }}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {t("googleSignInBtn")}
            </button>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {t("avatarLabel")}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.icon;
                  return (
                    <button
                      key={av.icon}
                      type="button"
                      onClick={() => {
                        playClick();
                        setSelectedAvatar(av.icon);
                      }}
                      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white scale-110 shadow-lg shadow-cyan-500/30 border-2 border-cyan-300"
                          : "bg-slate-800/70 border border-slate-700/60 hover:bg-slate-700/60"
                      }`}
                    >
                      {av.icon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Player Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {t("nameLabel")}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  maxLength={20}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-slate-100 placeholder-slate-500 font-medium text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Start Quest Submit Button */}
            <motion.button
              whileHover={{ scale: name.trim() ? 1.02 : 1 }}
              whileTap={{ scale: name.trim() ? 0.98 : 1 }}
              disabled={!name.trim()}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-base py-3.5 shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-cyan-500/40 transition-all cursor-pointer mt-2"
            >
              <span>{t("startQuestBtn")}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Google account chooser modal */}
      <GoogleAccountPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleGoogleSignIn}
        onUseAnother={() => {
          setPickerOpen(false);
          setView("manual");
        }}
        loading={signingIn}
      />
    </div>
  );
}
