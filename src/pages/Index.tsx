import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Globe, Map, CheckCircle2, XCircle, Trophy, PlayCircle, RefreshCcw, Home, BarChart2, Type, SkipForward } from "lucide-react";
import { shuffleArray, worldDifficulties, usDifficulties, type DifficultyLevel } from "@/utils/gameUtils";
import { generateQuestions, normalizeString } from '@/utils/flagData';
import { saveGameResult } from '@/utils/statsUtils';
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameSummary } from "@/components/GameSummary";

interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
  aliases?: string[];
}

interface GameState {
  mode: "world" | "us" | null;
  gameMode: "multiple" | "type" | null;
  difficulty: DifficultyLevel | null;
}

interface GameHistory {
  flagUrl: string;
  correctAnswer: string;
  userAnswer?: string;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({ 
    mode: null, 
    gameMode: null, 
    difficulty: null 
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  
  // Move useRef to top level
  const inputRef = useRef<HTMLInputElement>(null);

  // Move useEffect to top level and add condition inside
  useEffect(() => {
    if (gameState.gameMode === "type" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion, gameState.gameMode]);

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
    setGameState({ mode, gameMode: null, difficulty: null });
  };

  const handleGameModeSelect = (gameMode: "multiple" | "type") => {
    setGameState(prev => ({ ...prev, gameMode }));
  };

  const handlePlayAgain = () => {
    setGameState({ mode: null, gameMode: null, difficulty: null });
    setGameQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameHistory([]);
    setInputValue("");
  };

  const handleBackToMenu = () => {
    setGameState({ mode: null, gameMode: null, difficulty: null });
    setGameQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameHistory([]);
    setInputValue("");
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

    // Add current question to game history
    setGameHistory(prev => [...prev, {
      flagUrl: gameQuestions[currentQuestion].flagUrl,
      correctAnswer: gameQuestions[currentQuestion].correctAnswer,
      userAnswer: option
    }]);

    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setInputValue(""); // Reset input when moving to next question
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

  const handleSkipQuestion = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setGameHistory(prev => [...prev, {
        flagUrl: gameQuestions[currentQuestion].flagUrl,
        correctAnswer: gameQuestions[currentQuestion].correctAnswer
      }]);
      setCurrentQuestion(prev => prev + 1);
      setInputValue("");
      setIsCorrect(null);
      setIsAnswered(false);
      toast({
        title: "Question Skipped",
        description: `Correct answer: ${gameQuestions[currentQuestion].correctAnswer}`,
        duration: 2000,
      });
    }
  };

  if (!gameState.mode) {
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
              onClick={() => handleGameStart("world")}
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
              onClick={() => handleGameStart("us")}
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

  if (gameState.mode && !gameState.gameMode) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <header className="text-center space-y-4">
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Home className="w-6 h-6 text-primary" />
            </button>
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            <h1 className="text-4xl font-bold text-primary">Select Game Mode</h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameModeSelect("multiple")}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold text-primary mb-2">Multiple Choice</h2>
              <p className="text-muted-foreground">Choose from four options to identify the flag</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameModeSelect("type")}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20 dark:hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <Type className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-bold text-primary mb-2">Type Answer</h2>
              <p className="text-muted-foreground">Type the name of the country or state</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState.mode && gameState.gameMode && !gameState.difficulty) {
    const difficulties = gameState.mode === "world" ? worldDifficulties : usDifficulties;
    
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <header className="text-center space-y-4">
            <button
              onClick={handleBackToMenu}
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
                onClick={() => handleDifficultySelect(diff)}
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
  }

  if (gameState.difficulty && gameState.gameMode === "type") {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <motion.div className="max-w-2xl mx-auto space-y-8">
          <header className="relative text-center space-y-4">
            <button
              onClick={handleBackToMenu}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Home className="w-6 h-6 text-primary" />
            </button>
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
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
                className="relative max-w-lg mx-auto rounded-lg overflow-hidden bg-card"
              >
                <img
                  src={gameQuestions[currentQuestion].flagUrl}
                  alt="Flag"
                  className="w-full h-auto object-contain bg-white dark:bg-gray-800"
                  style={{ aspectRatio: '3/2' }}
                />
              </motion.div>

              <div className="w-full max-w-md mx-auto space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type country name..."
                    value={inputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValue(value);
                      if (!isAnswered) {
                        const normalizedInput = normalizeString(value);
                        const currentFlag = gameQuestions[currentQuestion];
                        const isMatch = currentFlag.aliases?.some(alias => 
                          normalizeString(alias) === normalizedInput
                        );
                        
                        setIsCorrect(value.length > 0 ? isMatch : null);
                        
                        if (isMatch) {
                          handleAnswer(currentFlag.correctAnswer);
                          setGameHistory(prev => [...prev, {
                            flagUrl: currentFlag.flagUrl,
                            correctAnswer: currentFlag.correctAnswer,
                            userAnswer: value
                          }]);
                        }
                      }
                    }}
                    className={`w-full p-4 rounded-lg bg-card text-card-foreground shadow-sm transition-all focus:outline-none focus:ring-2 
                      ${isCorrect === true ? 'ring-green-500' : isCorrect === false ? 'ring-red-500' : 'focus:ring-primary'}
                      ${isAnswered ? 'opacity-50' : ''}`}
                    disabled={isAnswered}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isCorrect !== null && (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={handleSkipQuestion}
                    disabled={isAnswered}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip Question
                  </button>
                  {!isAnswered && inputValue.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Keep typing...
                    </p>
                  )}
                </div>

                {isAnswered && (
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Correct answer: {gameQuestions[currentQuestion].correctAnswer}</p>
                    {gameQuestions[currentQuestion].aliases?.length > 0 && (
                      <p className="mt-1">
                        Also accepted: {gameQuestions[currentQuestion].aliases.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {currentQuestion === gameQuestions.length - 1 && isAnswered && (
            <GameSummary
              score={score}
              total={gameQuestions.length}
              onPlayAgain={handlePlayAgain}
              gameMode={gameState.gameMode!}
              mode={gameState.mode!}
              questions={gameHistory}
            />
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

  if (gameState.difficulty && gameState.gameMode === "multiple") {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <motion.div className="max-w-2xl mx-auto space-y-8">
          <header className="relative text-center space-y-4">
            <button
              onClick={handleBackToMenu}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Home className="w-6 h-6 text-primary" />
            </button>
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
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
                className="relative max-w-lg mx-auto rounded-lg overflow-hidden bg-card"
              >
                <img
                  src={gameQuestions[currentQuestion].flagUrl}
                  alt="Flag"
                  className="w-full h-auto object-contain bg-white dark:bg-gray-800"
                  style={{ aspectRatio: '3/2' }}
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
                    className={`w-full p-4 rounded-lg transition-all duration-200 text-lg font-medium flex items-center justify-between cursor-pointer
                      ${
                        isAnswered && option === gameQuestions[currentQuestion].correctAnswer
                          ? "bg-green-500 dark:bg-green-600 text-white shadow-green-500/20 dark:shadow-green-500/30"
                          : isAnswered && option === selectedAnswer
                          ? "bg-red-500 dark:bg-red-600 text-white shadow-red-500/20 dark:shadow-red-500/30"
                          : "bg-card text-card-foreground hover:bg-secondary/20 shadow-sm hover:shadow-lg dark:shadow-primary/10 dark:hover:shadow-primary/20"
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
            <GameSummary
              score={score}
              total={gameQuestions.length}
              onPlayAgain={handlePlayAgain}
              gameMode={gameState.gameMode!}
              mode={gameState.mode!}
              questions={gameHistory}
            />
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

