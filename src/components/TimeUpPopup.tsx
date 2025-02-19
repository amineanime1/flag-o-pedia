import { motion } from "framer-motion";
import { Timer, X } from "lucide-react";

interface TimeUpPopupProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function TimeUpPopup({ score, total, onPlayAgain, onBackToMenu }: TimeUpPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-500">Time's Up!</h2>
          <button
            onClick={onBackToMenu}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Timer className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              Final Score: {score}/{total}
            </p>
            <p className="text-muted-foreground mt-2">
              You've completed {score} out of {total} flags
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={onPlayAgain}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 