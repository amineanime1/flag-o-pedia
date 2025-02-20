import { motion } from "framer-motion";
import { Trophy, RefreshCcw, Share2 } from "lucide-react";

interface GameSummaryProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
  gameMode: "multiple" | "type";
  mode: "world" | "us";
  questions: Array<{
    flagUrl: string;
    correctAnswer: string;
    userAnswer?: string;
  }>;
}

export function GameSummary({ score, total, onPlayAgain, gameMode, mode, questions }: GameSummaryProps) {
  const percentage = Math.round((score / total) * 100);
  // Filter questions to only show answered ones for the current game
  const currentGameQuestions = questions.slice(-total);
  
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
          <p className="text-lg text-muted-foreground">{percentage}% Correct</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Game Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>Mode: {mode === 'world' ? 'World Flags' : 'US States'}</div>
          <div>Type: {gameMode === 'multiple' ? 'Multiple Choice' : 'Type Answer'}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Questions Review</h3>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {currentGameQuestions.map((q, idx) => (
            <div key={idx} className="flex items-center gap-4 p-2 rounded-lg bg-secondary/20">
              <img 
                src={q.flagUrl} 
                alt={q.correctAnswer}
                className="w-16 h-10 object-cover rounded shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{q.correctAnswer}</p>
                {q.userAnswer && (
                  <p className={`text-xs ${
                    q.userAnswer === q.correctAnswer 
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}>
                    Your answer: {q.userAnswer}
                  </p>
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
            const text = `🎮 Flag-o-pedia\n🏆 Score: ${score}/${total} (${percentage}%)\n🌍 Mode: ${mode === 'world' ? 'World Flags' : 'US States'}\n🎯 Type: ${gameMode === 'multiple' ? 'Multiple Choice' : 'Type Answer'}`;
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
