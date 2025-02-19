import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type DifficultyLevel } from "@/utils/gameUtils";

interface DifficultySelectProps {
  difficulties: DifficultyLevel[];
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBackToMenu: () => void;
}

export const DifficultySelect = ({ 
  difficulties, 
  onDifficultySelect, 
  onBackToMenu 
}: DifficultySelectProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <header className="text-center space-y-4">
          <button
            onClick={onBackToMenu}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Home className="w-6 h-6 text-primary" />
          </button>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-primary">Select Difficulty</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {difficulties.map((diff) => (
            <motion.button
              key={diff.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDifficultySelect(diff)}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <h2 className="text-xl font-bold text-primary mb-2">{diff.name}</h2>
              <p className="text-muted-foreground">{diff.flagCount} Flags</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 