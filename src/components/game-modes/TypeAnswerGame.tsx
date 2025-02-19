import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Map, CheckCircle2, XCircle, Trophy, Home, SkipForward } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameSummary } from "@/components/GameSummary";
import { Timer } from "@/components/Timer";
import { normalizeString } from '@/utils/flagData';
import type { Question, GameHistory } from "@/types/game";

interface TypeAnswerGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  inputValue: string;
  isCorrect: boolean | null;
  gameHistory: GameHistory[];
  onAnswer: (answer: string) => void;
  onSkipQuestion: () => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
  setInputValue: (value: string) => void;
  timeRemaining?: number | null;
}

export const TypeAnswerGame = ({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  inputValue,
  isCorrect,
  gameHistory,
  onAnswer,
  onSkipQuestion,
  onBackToMenu,
  onPlayAgain,
  setInputValue,
  timeRemaining,
}: TypeAnswerGameProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion]);

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
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-lg font-medium">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Score:</span>
              <span className="text-primary">{score}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary">{questions.length}</span>
            </div>
            {timeRemaining !== null && (
              <Timer timeRemaining={timeRemaining} />
            )}
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
              <motion.div
                className="relative aspect-video rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={questions[currentQuestion].flagUrl}
                  alt="Flag to guess"
                  className="w-full h-full object-cover"
                  style={{
                    filter: questions[currentQuestion].blurAmount 
                      ? `blur(${questions[currentQuestion].blurAmount}px)` 
                      : 'none'
                  }}
                />
              </motion.div>
            </motion.div>

            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type country name..."
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValue(value);
                    if (!isAnswered) {
                      const normalizedInput = normalizeString(value);
                      const currentFlag = questions[currentQuestion];
                      const isMatch = currentFlag.aliases?.some(alias => 
                        normalizeString(alias) === normalizedInput
                      );
                      
                      if (isMatch) {
                        onAnswer(currentFlag.correctAnswer);
                      }
                    }
                  }}
                  className={`w-full p-4 rounded-lg bg-card text-card-foreground shadow-sm transition-all focus:outline-none focus:ring-2 
                    ${isCorrect === true ? 'ring-green-500' : isCorrect === false ? 'ring-red-500' : 'focus:ring-primary'}
                    ${isAnswered ? 'opacity-50' : ''}`}
                  disabled={isAnswered}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isCorrect !== null && (
                    isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={onSkipQuestion}
                  disabled={isAnswered}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip Question
                </button>
                {!isAnswered && inputValue.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Keep typing...
                  </p>
                )}
              </div>

              {isAnswered && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Correct answer: {questions[currentQuestion].correctAnswer}</p>
                  {questions[currentQuestion].aliases?.length > 0 && (
                    <p className="mt-1">
                      Also accepted: {questions[currentQuestion].aliases.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion === questions.length - 1 && isAnswered && (
          <GameSummary
            score={score}
            total={questions.length}
            onPlayAgain={onPlayAgain}
            gameMode="type"
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