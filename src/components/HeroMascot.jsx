import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { playClick } from "../utils/sound";

export default function HeroMascot({ avatar = "⚡", size = "normal" }) {
  const { t } = useLanguage();
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isTapped, setIsTapped] = useState(false);

  const quotes = t("heroQuotes") || [
    "Keling, yangi so'zlarni zabt etamiz! ⚡",
    "Har kuni 5 daqiqa kifoya! 🚀",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  function handleTapHero() {
    playClick();
    setIsTapped(true);
    setBubbleIndex((prev) => (prev + 1) % quotes.length);
    setShowBubble(true);
    setTimeout(() => setIsTapped(false), 500);
  }

  const isSmall = size === "small";

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={bubbleIndex}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="relative mb-2 max-w-[260px] sm:max-w-xs px-3.5 py-2 rounded-2xl bg-gradient-to-r from-slate-900/95 to-slate-800/95 border border-cyan-500/30 text-xs font-semibold text-cyan-200 shadow-xl shadow-cyan-950/40 backdrop-blur-md text-center cursor-pointer"
            onClick={handleTapHero}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{quotes[bubbleIndex % quotes.length]}</span>
            </div>
            {/* Bubble arrow pointer */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-850 rotate-45 border-r border-b border-cyan-500/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Character Avatar */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        animate={
          isTapped
            ? { scale: [1, 1.25, 0.95, 1], y: [0, -20, 0] }
            : { y: [0, -6, 0] }
        }
        transition={
          isTapped
            ? { duration: 0.45 }
            : { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }
        onClick={handleTapHero}
        className={`relative ${
          isSmall ? "w-14 h-14 text-2xl" : "w-20 h-20 text-4xl"
        } rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 border-2 border-cyan-300/40 cursor-pointer group`}
      >
        {/* Ambient Ring Glow */}
        <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all" />

        {/* Mascot Face Icon */}
        <span className="relative z-10 drop-shadow-md">{avatar || "⚡"}</span>

        {/* Mini Status Badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow">
          <Heart className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      </motion.div>
    </div>
  );
}
