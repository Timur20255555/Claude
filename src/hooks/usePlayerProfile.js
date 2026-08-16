import { useEffect, useState, useCallback } from "react";

const XP_PER_LEVEL = 100;
const STORAGE_PROFILE_KEY = "lingoquest_player_profile";

const RANKS = [
  { minLevel: 1, titleUz: "Boshlang'ich", titleRu: "Новичок", titleEn: "Novice", badge: "🌱" },
  { minLevel: 3, titleUz: "So'z Izlovchi", titleRu: "Словолов", titleEn: "Word Scout", badge: "⚡" },
  { minLevel: 5, titleUz: "Poliglot", titleRu: "Полиглот", titleEn: "Polyglot", badge: "🎯" },
  { minLevel: 8, titleUz: "Lingo Ustasi", titleRu: "Мастер Lingo", titleEn: "Lingo Master", badge: "💎" },
  { minLevel: 12, titleUz: "Afsonaviy Bilimdon", titleRu: "Легенда Языков", titleEn: "Grandmaster", badge: "👑" },
];

export function getRank(level, lang = "uz") {
  let matched = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.minLevel) {
      matched = r;
    }
  }
  const titleKey = lang === "ru" ? "titleRu" : lang === "en" ? "titleEn" : "titleUz";
  return {
    badge: matched.badge,
    title: matched[titleKey] || matched.titleUz,
  };
}

const DEFAULT_PROFILE = {
  name: "",
  avatar: "⚡",
  lang: "uz",
  difficulty: "medium",
  xp: 0,
  level: 1,
  xpIntoLevel: 0,
  xpGoal: XP_PER_LEVEL,
  streak: 1,
  bestScore: 0,
  gamesPlayed: 0,
  totalCorrect: 0,
  achievements: ["welcome"],
  customWords: [],
};

function getLocalProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_PROFILE;
}

function saveLocalProfile(data) {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(data));
  } catch {}
}

export function usePlayerProfile() {
  const [profile, setProfile] = useState(getLocalProfile);

  // Sync profile from backend or localStorage on mount
  useEffect(() => {
    fetch("/api/user")
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (user && Object.keys(user).length > 0 && user.name) {
          setProfile((prev) => {
            const next = { ...prev, ...user };
            saveLocalProfile(next);
            return next;
          });
        }
      })
      .catch(() => {});

    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : null))
      .then((prog) => {
        if (prog && Object.keys(prog).length > 0) {
          setProfile((prev) => {
            const next = { ...prev, ...prog };
            saveLocalProfile(next);
            return next;
          });
        }
      })
      .catch(() => {});
  }, []);

  const updateUser = useCallback(async (fields) => {
    setProfile((prev) => {
      const next = { ...prev, ...fields };
      saveLocalProfile(next);
      return next;
    });

    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    } catch {}
  }, []);

  const completeSession = useCallback(async (score, roundStats = {}) => {
    const { correct = 0, total = 0 } = roundStats;
    let summary = null;

    try {
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, correct, total }),
      });
      if (res.ok) {
        const data = await res.json();
        summary = data.summary;
        setProfile((prev) => {
          const next = { ...prev, ...data.progress };
          saveLocalProfile(next);
          return next;
        });
        return summary;
      }
    } catch {}

    // Local calculation fallback
    const prevLevel = Math.floor((profile.xp || 0) / XP_PER_LEVEL) + 1;
    const newXp = (profile.xp || 0) + score;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const newBest = Math.max(profile.bestScore || 0, score);
    const newGames = (profile.gamesPlayed || 0) + 1;
    const newCorrect = (profile.totalCorrect || 0) + correct;

    const nextState = {
      ...profile,
      xp: newXp,
      level: newLevel,
      xpIntoLevel: newXp % XP_PER_LEVEL,
      xpGoal: XP_PER_LEVEL,
      streak: profile.streak || 1,
      bestScore: newBest,
      gamesPlayed: newGames,
      totalCorrect: newCorrect,
    };

    setProfile(nextState);
    saveLocalProfile(nextState);

    summary = {
      leveledUp: newLevel > prevLevel,
      newLevel,
      streakIncreased: false,
      streak: profile.streak || 1,
      isNewBest: score > 0 && score >= (profile.bestScore || 0),
    };

    return summary;
  }, [profile]);

  const addCustomWord = useCallback((newWord) => {
    setProfile((prev) => {
      const existing = prev.customWords || [];
      const updated = [newWord, ...existing.filter((w) => w.en !== newWord.en)];
      const next = { ...prev, customWords: updated };
      saveLocalProfile(next);
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      localStorage.removeItem("lingoquest_lang");
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", avatar: "⚡", difficulty: "medium" }),
      });
    } catch {}

    setProfile({ ...DEFAULT_PROFILE });
  }, []);

  return {
    ...profile,
    updateUser,
    completeSession,
    addCustomWord,
    logout,
  };
}
