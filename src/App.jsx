import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Header from "./components/Header";
import RegisterScreen from "./components/RegisterScreen";
import DifficultyScreen from "./components/DifficultyScreen";
import GameTrainer from "./components/GameTrainer";
import WordScrambleGame from "./components/WordScrambleGame";
import FlashcardsGame from "./components/FlashcardsGame";
import ListeningChallengeGame from "./components/ListeningChallengeGame";
import ResultsScreen from "./components/ResultsScreen";
import VocabularyVaultModal from "./components/VocabularyVaultModal";
import SmartTranslatorModal from "./components/SmartTranslatorModal";
import { usePlayerProfile } from "./hooks/usePlayerProfile";
import { LanguageProvider } from "./context/LanguageContext";

function MainApp() {
  const profile = usePlayerProfile();
  const [step, setStep] = useState(() => {
    return profile?.name ? "difficulty" : "register";
  });

  const [gameMode, setGameMode] = useState("speed"); // speed | scramble | flashcards | listening
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("all");
  const [lastResults, setLastResults] = useState(null);
  const [lastSummary, setLastSummary] = useState(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  async function handleFinish(results) {
    const summary = await profile.completeSession(results.score, {
      correct: results.correct,
      total: results.total,
    });
    setLastResults(results);
    setLastSummary(summary);
    setStep("results");
  }

  function handleLogout() {
    profile.logout();
    setStep("register");
  }

  function handleSelectMode(selectedMode, selectedDiff, selectedCat) {
    setGameMode(selectedMode);
    setDifficulty(selectedDiff);
    setCategory(selectedCat);

    if (selectedMode === "speed") {
      setStep("speedQuiz");
    } else if (selectedMode === "scramble") {
      setStep("scramble");
    } else if (selectedMode === "flashcards") {
      setStep("flashcards");
    } else if (selectedMode === "listening") {
      setStep("listening");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "1rem",
            color: "#f8fafc",
          },
        }}
      />

      {/* Global Modern Header */}
      <Header
        profile={profile}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenTranslator={() => setIsTranslatorOpen(true)}
        onLogout={handleLogout}
      />

      {/* Vocabulary Vault Modal */}
      <VocabularyVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        customWords={profile?.customWords || []}
      />

      {/* Smart Translator Modal (Perevodchik) */}
      <SmartTranslatorModal
        isOpen={isTranslatorOpen}
        onClose={() => setIsTranslatorOpen(false)}
        onAddToVault={profile.addCustomWord}
      />

      {/* Screen Routing */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          {step === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <RegisterScreen
                profile={profile}
                onNext={() => setStep("difficulty")}
              />
            </motion.div>
          )}

          {step === "difficulty" && (
            <motion.div
              key="difficulty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <DifficultyScreen
                profile={profile}
                onSelectMode={handleSelectMode}
              />
            </motion.div>
          )}

          {step === "speedQuiz" && (
            <motion.div
              key="speedQuiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <GameTrainer
                difficulty={difficulty}
                category={category}
                onFinish={handleFinish}
              />
            </motion.div>
          )}

          {step === "scramble" && (
            <motion.div
              key="scramble"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <WordScrambleGame
                category={category}
                onFinish={handleFinish}
                onExit={() => setStep("difficulty")}
              />
            </motion.div>
          )}

          {step === "flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <FlashcardsGame
                category={category}
                onFinish={handleFinish}
                onExit={() => setStep("difficulty")}
              />
            </motion.div>
          )}

          {step === "listening" && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <ListeningChallengeGame
                category={category}
                onFinish={handleFinish}
                onExit={() => setStep("difficulty")}
              />
            </motion.div>
          )}

          {step === "results" && lastResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ResultsScreen
                results={lastResults}
                summary={lastSummary}
                profile={profile}
                onRestart={() => {
                  if (gameMode === "speed") setStep("speedQuiz");
                  else if (gameMode === "scramble") setStep("scramble");
                  else if (gameMode === "flashcards") setStep("flashcards");
                  else if (gameMode === "listening") setStep("listening");
                }}
                onDifficulty={() => setStep("difficulty")}
                onHome={() => setStep("difficulty")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
