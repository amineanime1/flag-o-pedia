import { motion } from "framer-motion";
import { Home, Type, List, Map } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface GameModeSelectProps {
  onGameModeSelect: (mode: "multiple" | "type" | "map") => void;
  onBackToMenu: () => void;
}

export function GameModeSelect({ onGameModeSelect, onBackToMenu }: GameModeSelectProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <Home className="w-5 h-5" />
        Back to Menu
      </button>

      <h1 className="text-4xl font-bold text-center text-primary mb-12">
        Select Game Mode
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGameModeSelect("multiple")}
          className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <List className="w-12 h-12 text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Multiple Choice</h2>
            <p className="text-sm text-muted-foreground">
              Choose the correct answer from multiple options
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGameModeSelect("type")}
          className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Type className="w-12 h-12 text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Type Answer</h2>
            <p className="text-sm text-muted-foreground">
              Type the name of the country or state
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGameModeSelect("map")}
          className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Map className="w-12 h-12 text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Map Location</h2>
            <p className="text-sm text-muted-foreground">
              Click on the map to locate the country
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
} 