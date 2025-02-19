import { motion, AnimatePresence } from "framer-motion";
import { Globe, Map, CheckCircle2, XCircle, Trophy, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameSummary } from "@/components/GameSummary";
import type { Question, GameHistory } from "@/types/game";

interface MultipleChoiceGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  gameHistory: GameHistory[];
  onAnswer: (answer: string) => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

export const MultipleChoiceGame = ({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  selectedAnswer,
  gameHistory,
  onAnswer,
  onBackToMenu,
  onPlayAgain,
}: MultipleChoiceGameProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <motion.div className="max-w-2xl mx-auto space-y-8">
        <header className="relative text-center space-y-4">
          <button
            onClick={onBackToMenu}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Home className="w-6 h-6 text-primary" />
          </button>
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-primary flex items-center justify-center gap-3"
          >
            {mode === "world" ? <Globe className="w-8 h-8" /> : <Map className="w-8 h-8" />}
            {mode === "world" ? "World Flags" : "US State Flags"}
          </motion.h1>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-lg font-medium"
          >
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Score:</span>
            <span className="text-primary">{score}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">{questions.length}</span>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-lg mx-auto rounded-lg overflow-hidden bg-card"
            >
              <img
                src={questions[currentQuestion].flagUrl}
                alt="Flag"
                className="w-full h-auto object-contain bg-white dark:bg-gray-800"
                style={{ aspectRatio: '3/2' }}
              />
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => onAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg transition-all duration-200 text-lg font-medium flex items-center justify-between cursor-pointer
                    ${
                      isAnswered && option === questions[currentQuestion].correctAnswer
                        ? "bg-green-500 dark:bg-green-600 text-white shadow-green-500/20 dark:shadow-green-500/30"
                        : isAnswered && option === selectedAnswer
                        ? "bg-red-500 dark:bg-red-600 text-white shadow-red-500/20 dark:shadow-red-500/30"
                        : "bg-card text-card-foreground hover:bg-secondary/20 shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20"
                    }
                  `}
                >
                  <span>{option}</span>
                  {isAnswered && option === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {isAnswered && option === selectedAnswer && option !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="w-5 h-5" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion === questions.length - 1 && isAnswered && (
          <GameSummary
            score={score}
            total={questions.length}
            onPlayAgain={onPlayAgain}
            gameMode="multiple"
            mode={mode}
            questions={gameHistory}
          />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 