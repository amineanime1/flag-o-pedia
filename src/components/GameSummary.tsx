import { motion } from "framer-motion";
import { Trophy, RefreshCcw, Share2, CheckCircle2, XCircle } from "lucide-react";
import type { GameHistory } from "@/types/game";

interface GameSummaryProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
  gameMode: "multiple" | "type";
  mode: "world" | "us";
  questions: GameHistory[];
}

export function GameSummary({ score, total, onPlayAgain, gameMode, mode, questions }: GameSummaryProps) {
  const percentage = Math.round((score / total) * 100);
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-500' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-500' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };
  
  const { grade, color } = getGrade(percentage);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card text-card-foreground p-8 rounded-lg shadow-lg dark:shadow-none space-y-6"
    >
      <div className="text-center">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary">Game Complete!</h2>
        <div className="mt-4 space-y-2">
          <p className="text-4xl font-bold text-primary">{score}/{total}</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg text-muted-foreground">{percentage}% - </p>
            <p className={`text-lg font-bold ${color}`}>Grade {grade}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Game Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>Mode: {mode === 'world' ? 'World Flags' : 'US States'}</div>
          <div>Type: {gameMode === 'multiple' ? 'Multiple Choice' : 'Type Answer'}</div>
          <div>Correct Answers: {score}</div>
          <div>Incorrect Answers: {total - score}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Questions Review</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
          {questions.map((q, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                q.userAnswer === q.correctAnswer 
                  ? 'bg-green-500/10 dark:bg-green-500/5'
                  : 'bg-red-500/10 dark:bg-red-500/5'
              }`}
            >
              <div className="flex-shrink-0">
                <img 
                  src={q.flagUrl} 
                  alt={q.correctAnswer}
                  className="w-20 h-12 object-cover rounded shadow-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{q.correctAnswer}</p>
                  {q.userAnswer ? (
                    q.userAnswer === q.correctAnswer ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground">(Skipped)</span>
                  )}
                </div>
                {q.userAnswer && q.userAnswer !== q.correctAnswer && (
                  <p className="text-xs text-red-500 mt-1">Your answer: {q.userAnswer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAgain}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          Play Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const text = `🎮 Flag-o-pedia\n🏆 Score: ${score}/${total} (${percentage}% - Grade ${grade})\n🌍 Mode: ${mode === 'world' ? 'World Flags' : 'US States'}\n🎯 Type: ${gameMode === 'multiple' ? 'Multiple Choice' : 'Type Answer'}`;
            navigator.clipboard.writeText(text);
          }}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all inline-flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Score
        </motion.button>
      </div>
    </motion.div>
  );
}
