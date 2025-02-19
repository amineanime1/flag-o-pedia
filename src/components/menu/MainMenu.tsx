import { motion } from "framer-motion";
import { Globe, Map, BarChart2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MainMenuProps {
  onGameStart: (mode: "world" | "us") => void;
  onStatsClick: () => void;
}

export const MainMenu = ({ onGameStart, onStatsClick }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <header className="text-center space-y-4 relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-primary"
          >
            Flag-o-pedia
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Choose your challenge:
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onGameStart("world")}
            className="p-6 rounded-lg bg-card text-card-foreground shadow-lg hover:shadow-xl dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all group cursor-pointer"
          >
            <div className="flex flex-col items-center gap-4">
              <Globe className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">World Flags</h2>
                <p className="text-muted-foreground">Test your knowledge of country flags from around the world</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onGameStart("us")}
            className="p-6 rounded-lg bg-card text-card-foreground shadow-lg hover:shadow-xl dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all group cursor-pointer"
          >
            <div className="flex flex-col items-center gap-4">
              <Map className="w-12 h-12 text-primary group-hover:text-primary/80 transition-colors" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">US State Flags</h2>
                <p className="text-muted-foreground">Challenge yourself with flags from US states</p>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mt-8"
        >
          <p>Pick a category to start your flag adventure! 🚀</p>
        </motion.div>

        <div className="flex flex-col items-center justify-center from-slate-900 to-slate-800 text-white p-4">
          <motion.button
            onClick={onStatsClick}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart2 className="w-6 h-6" />
            <span>Statistics</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}; 