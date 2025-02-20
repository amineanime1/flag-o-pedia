import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Globe, Map, CheckCircle2, XCircle, Trophy, PlayCircle, RefreshCcw, Home, BarChart2, Type, SkipForward, X } from "lucide-react";
import { shuffleArray, worldDifficulties, usDifficulties, type DifficultyLevel, getBlurAmount } from "@/utils/gameUtils";
import { generateQuestions, normalizeString } from '@/utils/flagData';
import { saveGameResult } from '@/utils/statsUtils';
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameSummary } from "@/components/GameSummary";
import { MainMenu } from "@/components/menu/MainMenu";
import { GameModeSelect } from "@/components/menu/GameModeSelect";
import { DifficultySelect } from "@/components/menu/DifficultySelect";
import { TypeAnswerGame } from "@/components/game-modes/TypeAnswerGame";
import { MultipleChoiceGame } from "@/components/game-modes/MultipleChoiceGame";
import { MapLocationGame } from "@/components/game-modes/MapLocationGame";
import type { GameState, Question, GameHistory, GameResult } from "@/types/game";

interface GameOverPopupProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const GameOverPopup = ({ score, total, onPlayAgain, onBackToMenu }: GameOverPopupProps) => {
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
          <h2 className="text-xl font-bold text-red-500">Game Over!</h2>
          <button
            onClick={onBackToMenu}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">No Death Mode: Game ends on first mistake</p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="font-medium">{score}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{total}</span>
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
};

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
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    const selectedFlags = generateQuestions(gameState.mode!, difficulty.flagCount);
    
    // Apply blur to questions if needed
    if (difficulty.modifiers?.blurLevel) {
      selectedFlags.forEach(flag => {
        flag.blurAmount = getBlurAmount(difficulty.modifiers!.blurLevel!);
      });
    }
    
    setGameQuestions(selectedFlags);
    setGameState(prev => ({ ...prev, difficulty }));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameHistory([]);
    
    // Setup timer if time limit modifier is present
    if (difficulty.modifiers?.timeLimit) {
      setTimeRemaining(difficulty.modifiers.timeLimit);
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            // End game when time runs out
            handleGameEnd(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
    
    toast({
      title: `Starting ${difficulty.name} mode!`, 
      description: `${difficulty.flagCount} flags to identify. Good luck! 🍀`,
      duration: 2000,
    });
  };

  const handleGameStart = (mode: "world" | "us") => {
    setGameState({ mode, gameMode: null, difficulty: null });
  };

  const handleGameModeSelect = (gameMode: "multiple" | "type" | "map") => {
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
    setIsCorrect(null);
  };

  const handleBackToMenu = () => {
    handlePlayAgain();
  };

  const handleStatsClick = () => {
    window.location.pathname = '/stats';
  };

  const handleGameEnd = (timeUp: boolean = false) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Guard against null states
    if (!gameState.mode || !gameState.gameMode || !gameState.difficulty || !gameQuestions.length) {
      console.warn('Game state is incomplete');
      return;
    }

    // Guard against invalid current question index
    const currentFlag = gameQuestions[currentQuestion];
    if (!currentFlag) {
      console.warn('Current question is undefined');
      return;
    }

    const result: Omit<GameResult, "date"> = {
      mode: gameState.mode,
      gameMode: gameState.gameMode,
      difficulty: gameState.difficulty.name,
      score,
      total: gameQuestions.length,
      timeRemaining: timeRemaining || undefined,
      perfectRun: score === gameQuestions.length,
      flagUrl: currentFlag.flagUrl,
      correctAnswer: currentFlag.correctAnswer,
      modifiers: gameState.difficulty.modifiers
    };

    // Save game stats
    saveGameResult(result);

    if (timeUp) {
      toast({
        title: "Time's Up!",
        description: `Final Score: ${score} out of ${gameQuestions.length}`,
        duration: 3000,
      });
    } else if (gameState.difficulty?.modifiers?.noDeath) {
      setShowGameOver(true);
    }
  };

  const handleAnswer = (option: string) => {
    if (isAnswered || !gameQuestions.length) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === gameQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else if (gameState.difficulty?.modifiers?.noDeath) {
      // End game immediately on first mistake in no death mode
      handleGameEnd();
      toast({
        title: "Game Over!",
        description: "No Death Mode: Game ends on first mistake",
        duration: 3000,
      });
      return;
    }

    // Add current question to game history
    setGameHistory(prev => [...prev, {
      flagUrl: gameQuestions[currentQuestion].flagUrl,
      correctAnswer: gameQuestions[currentQuestion].correctAnswer,
      userAnswer: option,
      timeSpent: gameState.difficulty?.modifiers?.timeLimit 
        ? gameState.difficulty.modifiers.timeLimit - (timeRemaining || 0)
        : undefined
    }]);

    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setInputValue("");
        setIsCorrect(null);
      } else if (gameState.mode && gameState.gameMode && gameState.difficulty) {
        handleGameEnd();
      }
    }, 1000);
  };

  const handleSkipQuestion = () => {
    if (!gameQuestions.length) return;

    setGameHistory(prev => [...prev, {
      flagUrl: gameQuestions[currentQuestion].flagUrl,
      correctAnswer: gameQuestions[currentQuestion].correctAnswer
    }]);

    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setInputValue("");
      setIsCorrect(null);
      setIsAnswered(false);
      toast({
        title: "Question Skipped",
        description: `Correct answer: ${gameQuestions[currentQuestion].correctAnswer}`,
        duration: 2000,
      });
    } else if (gameState.mode && gameState.gameMode && gameState.difficulty) {
      setIsAnswered(true);
      handleGameEnd();
    }
  };

  if (!gameState.mode) {
    return (
      <MainMenu
        onGameStart={handleGameStart}
        onStatsClick={handleStatsClick}
      />
    );
  }

  if (gameState.mode && !gameState.gameMode) {
    return (
      <GameModeSelect
        onGameModeSelect={handleGameModeSelect}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (gameState.mode && gameState.gameMode && !gameState.difficulty) {
    const difficulties = gameState.mode === "world" ? worldDifficulties : usDifficulties;
    return (
      <DifficultySelect
        difficulties={difficulties}
        onDifficultySelect={handleDifficultySelect}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (gameState.difficulty && gameState.gameMode === "type") {
    return (
      <TypeAnswerGame
        mode={gameState.mode}
        questions={gameQuestions}
        currentQuestion={currentQuestion}
        score={score}
        isAnswered={isAnswered}
        inputValue={inputValue}
        isCorrect={isCorrect}
        gameHistory={gameHistory}
        onAnswer={handleAnswer}
        onSkipQuestion={handleSkipQuestion}
        onBackToMenu={handleBackToMenu}
        onPlayAgain={handlePlayAgain}
        setInputValue={setInputValue}
        timeRemaining={timeRemaining}
      />
    );
  }

  if (gameState.difficulty && gameState.gameMode === "multiple") {
    return (
      <MultipleChoiceGame
        mode={gameState.mode}
        questions={gameQuestions}
        currentQuestion={currentQuestion}
        score={score}
        isAnswered={isAnswered}
        selectedAnswer={selectedAnswer}
        gameHistory={gameHistory}
        onAnswer={handleAnswer}
        onBackToMenu={handleBackToMenu}
        onPlayAgain={handlePlayAgain}
        timeRemaining={timeRemaining}
      />
    );
  }

  if (gameState.difficulty && gameState.gameMode === "map") {
    return (
      <MapLocationGame
        mode={gameState.mode}
        questions={gameQuestions}
        currentQuestion={currentQuestion}
        score={score}
        isAnswered={isAnswered}
        gameHistory={gameHistory}
        onAnswer={handleAnswer}
        onSkipQuestion={handleSkipQuestion}
        onBackToMenu={handleBackToMenu}
        onPlayAgain={handlePlayAgain}
        timeRemaining={timeRemaining}
      />
    );
  }

  if (showGameOver) {
    return (
      <GameOverPopup
        score={score}
        total={gameQuestions.length}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
};

export default Index;

