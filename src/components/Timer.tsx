import { motion } from "framer-motion";
import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  timeRemaining: number | null;
}

export function Timer({ timeRemaining }: TimerProps) {
  if (!timeRemaining) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <motion.div 
      className="flex items-center gap-2 bg-card px-3 py-1 rounded-full"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      <TimerIcon className="w-4 h-4 text-yellow-500" />
      <span className="font-medium">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
} 