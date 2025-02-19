import { type Question, type GameHistory } from "@/types/game";
import { Home } from "lucide-react";

interface TypeAnswerGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  inputValue: string;
  isCorrect: boolean | null;
  gameHistory: GameHistory[];
  timeRemaining: number | null;
  onAnswer: (answer: string) => void;
  onSkipQuestion: () => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
  setInputValue: (value: string) => void;
}

export function TypeAnswerGame({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  inputValue,
  isCorrect,
  gameHistory,
  timeRemaining,
  onAnswer,
  onSkipQuestion,
  onBackToMenu,
  onPlayAgain,
  setInputValue
}: TypeAnswerGameProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Game Header */}
        <header className="text-center space-y-4">
          <button
            onClick={onBackToMenu}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <h1 className="text-4xl font-bold text-primary">
            {mode === "world" ? "World" : "US"} Flags Quiz
          </h1>
          
          <div className="flex justify-center items-center gap-4">
            <p className="text-xl text-muted-foreground">
              Score: {score}/{questions.length}
            </p>
            {timeRemaining !== null && (
              <p className="text-xl font-bold text-primary">
                Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </header>

        {/* Flag Display */}
        <div className="relative aspect-video max-w-2xl mx-auto">
          <img
            src={questions[currentQuestion].flagUrl}
            alt="Flag to identify"
            className="w-full h-full object-contain"
            style={questions[currentQuestion].blurAmount ? {
              filter: `blur(${questions[currentQuestion].blurAmount}px)`
            } : undefined}
          />
        </div>

        {/* Input Section */}
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAnswered && inputValue.trim()) {
                onAnswer(inputValue.trim());
              }
            }}
            placeholder="Type the country name..."
            className={`w-full p-4 rounded-lg bg-card text-lg ${
              isAnswered
                ? isCorrect
                  ? "border-2 border-green-500"
                  : "border-2 border-red-500"
                : "border border-border"
            }`}
            disabled={isAnswered}
          />
          
          <div className="flex justify-between gap-4">
            <button
              onClick={onSkipQuestion}
              disabled={isAnswered}
              className="flex-1 p-4 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
            <button
              onClick={() => onAnswer(inputValue.trim())}
              disabled={isAnswered || !inputValue.trim()}
              className="flex-1 p-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 