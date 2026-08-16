import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lightbulb, Volume2, X } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { playClick, speakWord } from "../utils/sound";
import { getSmartDuoHint } from "../data/words";

export default function DuoCompanion({ currentWord, mood = "idle", onHintUsed }) {
  const { lang, t } = useLanguage();
  const [showHintBubble, setShowHintBubble] = useState(false);
  const [hintText, setHintText] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  function handleTriggerHint() {
    playClick();
    const hint = getSmartDuoHint(currentWord, lang);
    setHintText(hint);
    setShowHintBubble(true);
    setIsTalking(true);

    if (onHintUsed) onHintUsed();

    // Voice speak hint if short or speak the word
    if (currentWord?.en) {
      speakWord(currentWord.en);
    }

    setTimeout(() => setIsTalking(false), 2000);
  }

  return (
    <div className="relative inline-flex flex-col items-center select-none z-20">
      {/* Speaking Speech Bubble */}
      <AnimatePresence>
        {showHintBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="absolute bottom-full mb-3 max-w-[280px] sm:max-w-xs p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-850/95 border-2 border-emerald-500/50 text-xs font-semibold text-emerald-200 shadow-2xl shadow-emerald-950/60 backdrop-blur-md text-left z-30"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Duo Maslahati:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHintBubble(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="mt-1.5 text-slate-100 text-xs leading-relaxed font-medium">
              {hintText}
            </p>

            <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  if (currentWord?.en) speakWord(currentWord.en);
                }}
                className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>{t("listenPronounce")}</span>
              </button>
              <span className="text-[10px] text-slate-400">🦉 Duo AI Helper</span>
            </div>

            {/* Downward pointer triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rotate-45 border-r-2 border-b-2 border-emerald-500/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duo Owl Companion Mascot Avatar */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={
          isTalking
            ? { y: [0, -8, 0, -8, 0], rotate: [0, -3, 3, -3, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          isTalking
            ? { duration: 0.8, ease: "easeInOut" }
            : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
        }
        onClick={handleTriggerHint}
        className="relative group cursor-pointer p-1"
        title="Duo'dan maslahat olish (Click for Hint)"
      >
        {/* Glow Halo */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/40 transition-all" />

        {/* Vector Duo Owl Mascot Avatar Body */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-emerald-300 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden">
          {/* Owl Face & Eyes */}
          <div className="flex items-center gap-1.5 mt-1">
            {/* Left Eye */}
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-inner">
              <motion.div
                animate={isTalking ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2.5 h-2.5 rounded-full bg-slate-900 flex items-center justify-center"
              >
                <div className="w-1 h-1 rounded-full bg-white -mt-0.5 -ml-0.5" />
              </motion.div>
            </div>
            {/* Right Eye */}
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-inner">
              <motion.div
                animate={isTalking ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2.5 h-2.5 rounded-full bg-slate-900 flex items-center justify-center"
              >
                <div className="w-1 h-1 rounded-full bg-white -mt-0.5 -ml-0.5" />
              </motion.div>
            </div>
          </div>

          {/* Orange Beak */}
          <div className="w-3.5 h-2.5 bg-amber-400 rounded-b-md shadow -mt-0.5 border-t border-amber-500" />

          {/* Belly Feather Pattern */}
          <div className="w-8 h-4 rounded-t-full bg-emerald-200/50 mt-1 flex items-center justify-center gap-0.5">
            <div className="w-1.5 h-1 rounded-full bg-emerald-700/40" />
            <div className="w-1.5 h-1 rounded-full bg-emerald-700/40" />
            <div className="w-1.5 h-1 rounded-full bg-emerald-700/40" />
          </div>

          {/* Floating Hint Bulb Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow animate-bounce">
            <Lightbulb className="w-3 h-3 fill-slate-950" />
          </div>
        </div>

        {/* Small "Hint" label pill */}
        <span className="mt-1 block text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
          Podskazka
        </span>
      </motion.button>
    </div>
  );
}
