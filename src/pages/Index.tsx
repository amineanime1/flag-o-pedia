import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Globe, Map, CheckCircle2, XCircle, Trophy, PlayCircle, RefreshCcw, Home, BarChart2  } from "lucide-react";
import { shuffleArray, worldDifficulties, usDifficulties, type DifficultyLevel } from "@/utils/gameUtils";
import { generateQuestions } from '@/utils/flagData';
import { saveGameResult } from '@/utils/statsUtils';

interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
}

interface GameState {
  mode: "world" | "us" | null;
  difficulty: DifficultyLevel | null;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({ mode: null, difficulty: null });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    const selectedFlags = generateQuestions(gameState.mode!, difficulty.flagCount);
    
    setGameQuestions(selectedFlags);
    setGameState(prev => ({ ...prev, difficulty }));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    toast({
      title: `Starting ${difficulty.name} mode!`,
      description: `${difficulty.flagCount} flags to identify. Good luck! 🍀`,
      duration: 2000,
    });
  };

  const handleGameStart = (mode: "world" | "us") => {
    setGameState({ mode, difficulty: null });
  };

  const handlePlayAgain = () => {
    setGameState({ mode: null, difficulty: null });
    setGameQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleBackToMenu = () => {
    setGameState({ mode: null, difficulty: null });
    setGameQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  const handleStatsClick = () => {
    window.location.href = '/stats';
  };
  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === gameQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Save game stats when game is complete
        saveGameResult({
          mode: gameState.mode!,
          difficulty: gameState.difficulty!.name,
          score: score + (isCorrect ? 1 : 0),
          total: gameQuestions.length
        });
        
        toast({
          title: "Game Complete!",
          description: `Final Score: ${score + (isCorrect ? 1 : 0)} out of ${gameQuestions.length}`,
          duration: 3000,
        });
      }
    }, 1000);
  };

  if (!gameState.mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <header className="text-center space-y-4">
      
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
              onClick={() => handleGameStart("world")}
              className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all group"
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
              onClick={() => handleGameStart("us")}
              className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all group"
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
              <div className="flex flex-col items-center justify-center  from-slate-900 to-slate-800 text-white p-4">
      
      <motion.button
        onClick={handleStatsClick}
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
  }

  if (gameState.mode && !gameState.difficulty) {
    const difficulties = gameState.mode === "world" ? worldDifficulties : usDifficulties;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <header className="text-center space-y-4">
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Home className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-4xl font-bold text-primary">Select Difficulty</h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDifficultySelect(diff)}
                className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <h2 className="text-xl font-bold text-primary mb-2">{diff.name}</h2>
                <p className="text-muted-foreground">{diff.flagCount} Flags</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState.difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
        <motion.div className="max-w-2xl mx-auto space-y-8">
          <header className="relative text-center space-y-4">
            <button
              onClick={handleBackToMenu}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Home className="w-6 h-6 text-primary" />
            </button>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-primary flex items-center justify-center gap-3"
            >
              {gameState.mode === "world" ? <Globe className="w-8 h-8" /> : <Map className="w-8 h-8" />}
              {gameState.mode === "world" ? "World Flags" : "US State Flags"}
            </motion.h1>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center space-x-2 text-lg font-medium"
            >
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">Score:</span>
              <span className="text-primary">{score}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary">{gameQuestions.length}</span>
            </motion.div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full aspect-video max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={gameQuestions[currentQuestion].flagUrl}
                  alt="Flag"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="grid grid-cols-1 gap-4">
                {gameQuestions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg shadow-sm transition-colors duration-200 text-lg font-medium flex items-center justify-between
                      ${
                        isAnswered && option === gameQuestions[currentQuestion].correctAnswer
                          ? "bg-green-500 text-white"
                          : isAnswered && option === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    <span>{option}</span>
                    {isAnswered && option === gameQuestions[currentQuestion].correctAnswer && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {isAnswered && option === selectedAnswer && option !== gameQuestions[currentQuestion].correctAnswer && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {currentQuestion === gameQuestions.length - 1 && isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-primary">Game Complete!</h2>
                <p className="text-lg text-muted-foreground">
                  Final Score: {score} out of {gameQuestions.length}
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
              </motion.button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>Question {currentQuestion + 1} of {gameQuestions.length}</p>
            </motion.div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Index;

