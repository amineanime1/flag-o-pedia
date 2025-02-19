import { type Question, type GameHistory } from "@/types/game";
import { Home } from "lucide-react";

interface MultipleChoiceGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  gameHistory: GameHistory[];
  timeRemaining: number | null;
  onAnswer: (option: string) => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

export function MultipleChoiceGame({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  selectedAnswer,
  gameHistory,
  timeRemaining,
  onAnswer,
  onBackToMenu,
  onPlayAgain
}: MultipleChoiceGameProps) {
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

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {questions[currentQuestion].options?.map((option) => (
            <button
              key={option}
              onClick={() => !isAnswered && onAnswer(option)}
              disabled={isAnswered}
              className={`p-4 rounded-lg text-lg font-medium transition-colors ${
                isAnswered
                  ? option === questions[currentQuestion].correctAnswer
                    ? "bg-green-500 text-white"
                    : option === selectedAnswer
                    ? "bg-red-500 text-white"
                    : "bg-secondary text-muted-foreground"
                  : "bg-card hover:bg-secondary/80"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 