import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  X,
  Flame,
  Zap,
  Send,
  UserPlus,
  Swords,
} from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { playClick } from "../utils/sound";

// Demo friend list so the leaderboard works without a real backend.
const MOCK_FRIENDS = [
  { id: "f1", name: "Aziz", avatar: "🦁", xp: 1240, streak: 7 },
  { id: "f2", name: "Dilnoza", avatar: "🦊", xp: 980, streak: 5 },
  { id: "f3", name: "Jamshid", avatar: "🚀", xp: 720, streak: 3 },
  { id: "f4", name: "Malika", avatar: "🐼", xp: 540, streak: 2 },
  { id: "f5", name: "Sardor", avatar: "👑", xp: 310, streak: 1 },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export default function FriendsLeaderboard({ isOpen, onClose, profile }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const playerRow = {
    id: "me",
    name: profile?.name || "Explorer",
    avatar: profile?.avatar || "🦉",
    xp: profile?.xp || 0,
    streak: profile?.streak || 1,
    isPlayer: true,
  };

  const rows = [...MOCK_FRIENDS, playerRow]
    .sort((a, b) => b.xp - a.xp)
    .map((row, idx) => ({ ...row, rank: idx + 1 }));

  function shareTelegram(text) {
    playClick();
    const url = window.location.origin;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  }

  function handleChallenge(friend) {
    const msg = t("challengeMessage", { name: friend.name, score: profile?.xp || 0 });
    shareTelegram(msg);
  }

  function handleInvite() {
    shareTelegram(t("inviteMessage"));
  }

  const playerRank = rows.find((r) => r.isPlayer)?.rank || 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-6 z-10 space-y-4 max-h-[88vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  {t("leaderboardTitle")}
                </h2>
                <p className="text-[11px] text-slate-400">{t("leaderboardSubtitle")}</p>
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

          {/* Your rank banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 border border-cyan-500/40 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300">
              {t("rankLabel")} #{playerRank} {t("youLabel").toLowerCase()} 🎯
            </span>
            <span className="text-xs font-black text-slate-100">
              {profile?.xp || 0} {t("xp")}
            </span>
          </div>

          {/* Leaderboard rows */}
          <div className="space-y-2">
            {rows.map((row) => {
              const medal = MEDALS[row.rank - 1];
              const isPlayer = row.isPlayer;
              return (
                <div
                  key={row.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    isPlayer
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400/60 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-800/50 border-slate-700/60"
                  }`}
                >
                  <span className="w-7 text-center text-lg shrink-0">
                    {medal || <span className="text-xs font-mono text-slate-500">{row.rank}</span>}
                  </span>

                  <span className="text-2xl shrink-0">{row.avatar}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold truncate ${isPlayer ? "text-cyan-300" : "text-slate-100"}`}>
                        {row.name}
                      </span>
                      {isPlayer && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/25 text-cyan-300 border border-cyan-500/40">
                          {t("youLabel")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        {row.xp} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {row.streak} {t("daysSuffix")}
                      </span>
                    </div>
                  </div>

                  {!isPlayer && (
                    <button
                      type="button"
                      onClick={() => handleChallenge(row)}
                      title={t("challengeBtn")}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700/70 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-slate-200 hover:text-white text-[11px] font-bold transition-all cursor-pointer shrink-0"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t("challengeBtn")}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Invite friend */}
          <button
            type="button"
            onClick={handleInvite}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t("inviteFriendBtn")}</span>
            <Send className="w-4 h-4 opacity-70" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
