import { motion } from "framer-motion";
import { Home, Timer, Eye, Skull, Zap, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { type DifficultyLevel } from "@/utils/gameUtils";

interface DifficultySelectProps {
  difficulties: DifficultyLevel[];
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBackToMenu: () => void;
}

export function DifficultySelect({ 
  difficulties, 
  onDifficultySelect, 
  onBackToMenu 
}: DifficultySelectProps) {
  const getDifficultyIcon = (diff: DifficultyLevel) => {
    if (diff.modifiers?.timeLimit) return Timer;
    if (diff.modifiers?.blurLevel) return Eye;
    if (diff.modifiers?.noDeath) return Skull;
    if (diff.name.includes("Ultimate")) return Star;
    return Zap;
  };

  const getDifficultyColor = (diff: DifficultyLevel) => {
    if (diff.modifiers?.timeLimit) return "text-yellow-500";
    if (diff.modifiers?.blurLevel) return "text-blue-500";
    if (diff.modifiers?.noDeath) return "text-red-500";
    if (diff.name.includes("Ultimate")) return "text-purple-500";
    
    switch (diff.name) {
      case "Easy": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "Hard": return "text-orange-500";
      case "Expert": return "text-red-500";
      default: return "text-primary";
    }
  };

  const getModifierDescription = (diff: DifficultyLevel) => {
    const mods = [];
    if (diff.name.includes("Easy")) mods.push("Quick warmup");
    if (diff.name.includes("Medium")) mods.push("A bit of a challenge");
    if (diff.name.includes("Hard")) mods.push("Test your knowledge");
    if (diff.name.includes("Expert")) mods.push("All the flags");
    if (diff.modifiers?.noDeath) mods.push("Game Over on First Mistake");
    if (diff.modifiers?.blurLevel) mods.push(`${diff.modifiers.blurLevel} Blur Effect`);
    if (diff.modifiers?.timeLimit) mods.push(`${diff.modifiers.timeLimit / 60} Minute Time Limit`);
    return mods.join(" • ");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
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
          <p className="text-muted-foreground">Choose your challenge level</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {difficulties.map((diff) => {
            const Icon = getDifficultyIcon(diff);
            const colorClass = getDifficultyColor(diff);
            const modifierText = getModifierDescription(diff);

            return (
              <motion.button
                key={diff.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDifficultySelect(diff)}
                className="relative group p-6 rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 group-hover:from-primary/10 transition-colors" />
                
                {/* <Icon className={`w-8 h-8 mb-4 ${colorClass}`} /> */}
                
                <h2 className={`text-xl font-bold mb-2 ${colorClass}`}>
                  {diff.name}
                </h2>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {diff.flagCount} Flags
                  </p>
                  {modifierText && (
                    <p className="text-sm text-muted-foreground border-t border-border pt-2">
                      {modifierText}
                    </p>
                  )}
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
} 