// Web Audio API Sound Synthesizer & Speech Engine

let audioCtx = null;
let soundEnabled = true;

try {
  const saved = localStorage.getItem("lingoquest_sound_enabled");
  if (saved !== null) {
    soundEnabled = JSON.parse(saved);
  }
} catch {}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  try {
    localStorage.setItem("lingoquest_sound_enabled", JSON.stringify(enabled));
  } catch {}
}

export function toggleSound() {
  const next = !soundEnabled;
  setSoundEnabled(next);
  return next;
}

function getCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, start, duration, type = "sine", gainVal = 0.2) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    
    gain.gain.setValueAtTime(gainVal, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  } catch {}
}

export function playClick() {
  playTone(800, 0, 0.04, "sine", 0.08);
}

export function playCorrect() {
  playTone(523.25, 0, 0.1, "triangle", 0.22); // C5
  playTone(659.25, 0.08, 0.12, "triangle", 0.24); // E5
  playTone(783.99, 0.16, 0.25, "sine", 0.26); // G5
}

export function playWrong() {
  playTone(220, 0, 0.15, "sawtooth", 0.18);
  playTone(164.81, 0.1, 0.28, "sawtooth", 0.2);
}

export function playCombo(count = 2) {
  const base = 440 + Math.min(count * 50, 400);
  playTone(base, 0, 0.08, "sine", 0.2);
  playTone(base * 1.25, 0.06, 0.14, "triangle", 0.25);
  playTone(base * 1.5, 0.12, 0.22, "sine", 0.3);
}

export function playLevelUp() {
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    playTone(freq, idx * 0.09, 0.25, "triangle", 0.25);
  });
}

export function playPowerup() {
  playTone(350, 0, 0.08, "sine", 0.2);
  playTone(700, 0.06, 0.12, "sine", 0.25);
  playTone(1050, 0.12, 0.2, "triangle", 0.28);
}

export function playVictory() {
  const melody = [523.25, 659.25, 783.99, 1046.5];
  melody.forEach((f, i) => {
    playTone(f, i * 0.12, 0.35, "sine", 0.22);
  });
}

/**
 * Text-to-speech pronunciation for English words
 */
export function speakWord(text) {
  if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.default)
    ) || voices.find((v) => v.lang.startsWith("en"));
    
    if (enVoice) {
      utterance.voice = enVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch {}
}
