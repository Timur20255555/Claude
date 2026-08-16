import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const USER_FILE = path.join(__dirname, "user.json");
const XP_PER_LEVEL = 100;

function loadUser() {
  try {
    return JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
  } catch {
    return { name: "", avatar: "⚡", lang: "uz", difficulty: "medium" };
  }
}
function saveUser(u) {
  try {
    fs.writeFileSync(USER_FILE, JSON.stringify(u, null, 2));
  } catch {}
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return { xp: 0, streak: 1, lastPlayedDate: null, bestScore: 0, gamesPlayed: 0, totalCorrect: 0 };
  }
}
function saveProgress(p) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(p, null, 2));
  } catch {}
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function toCard(p) {
  const xp = p.xp || 0;
  return {
    xp,
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    xpIntoLevel: xp % XP_PER_LEVEL,
    xpGoal: XP_PER_LEVEL,
    streak: p.streak || 1,
    bestScore: p.bestScore || 0,
    gamesPlayed: p.gamesPlayed || 0,
    totalCorrect: p.totalCorrect || 0,
  };
}

const app = express();
app.use(cors());
app.use(express.json());

// User metadata endpoint
app.get("/api/user", (req, res) => {
  res.json(loadUser());
});

app.post("/api/user", (req, res) => {
  const current = loadUser();
  const next = { ...current, ...req.body };
  saveUser(next);
  res.json(next);
});

// Progress endpoint
app.get("/api/progress", (req, res) => {
  res.json(toCard(loadProgress()));
});

app.post("/api/progress/update", (req, res) => {
  const score = Number(req.body.score) || 0;
  const correct = Number(req.body.correct) || 0;
  const p = loadProgress();
  const prevLevel = Math.floor((p.xp || 0) / XP_PER_LEVEL) + 1;

  const newXp = (p.xp || 0) + score;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

  const today = isoDate(new Date());
  const yesterday = isoDate(new Date(Date.now() - 86400000));
  
  let newStreak = p.streak || 1;
  if (p.lastPlayedDate !== today) {
    if (p.lastPlayedDate === yesterday) {
      newStreak += 1;
    } else if (!p.lastPlayedDate) {
      newStreak = 1;
    } else {
      newStreak = 1;
    }
  }

  const isNewBest = score > 0 && score >= (p.bestScore || 0);
  const next = {
    xp: newXp,
    streak: newStreak,
    lastPlayedDate: today,
    bestScore: Math.max(p.bestScore || 0, score),
    gamesPlayed: (p.gamesPlayed || 0) + 1,
    totalCorrect: (p.totalCorrect || 0) + correct,
  };
  
  saveProgress(next);

  res.json({
    progress: toCard(next),
    summary: {
      leveledUp: newLevel > prevLevel,
      newLevel,
      streakIncreased: newStreak > (p.streak || 1),
      streak: newStreak,
      isNewBest,
    },
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`⚡ LingoQuest Server running on http://localhost:${PORT}`));
