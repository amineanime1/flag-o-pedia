import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Globe, Map, CheckCircle2, XCircle, Trophy, PlayCircle, RefreshCcw, Home, BarChart2, Type, SkipForward } from "lucide-react";
import { shuffleArray, worldDifficulties, usDifficulties, type DifficultyLevel } from "@/utils/gameUtils";
import { generateQuestions, normalizeString } from '@/utils/flagData';
import { saveGameResult } from '@/utils/statsUtils';
import { ThemeToggle } from "@/components/ThemeToggle";
import { GameSummary } from "@/components/GameSummary";
import { MainMenu } from "@/components/menu/MainMenu";
import { GameModeSelect } from "@/components/menu/GameModeSelect";
import { DifficultySelect } from "@/components/menu/DifficultySelect";
import { TypeAnswerGame } from "@/components/game-modes/TypeAnswerGame";
import { MultipleChoiceGame } from "@/components/game-modes/MultipleChoiceGame";
import type { GameState, Question, GameHistory } from "@/types/game";

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

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    const selectedFlags = generateQuestions(gameState.mode!, difficulty.flagCount);
    
    setGameQuestions(selectedFlags);
    setGameState(prev => ({ ...prev, difficulty }));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setGameHistory([]);
    
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
    setIsCorrect(null);
  };

  const handleBackToMenu = () => {
    handlePlayAgain();
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
        setInputValue("");
        setIsCorrect(null);
      } else {
        // Save game stats when game is complete
        saveGameResult({
          mode: gameState.mode!,
          gameMode: gameState.gameMode!,
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
    } else {
      // Handle last question skip
      setIsAnswered(true);
      saveGameResult({
        mode: gameState.mode!,
        gameMode: gameState.gameMode!,
        difficulty: gameState.difficulty!.name,
        score: score,
        total: gameQuestions.length
      });
      
      toast({
        title: "Game Complete!",
        description: `Final Score: ${score} out of ${gameQuestions.length}`,
        duration: 3000,
      });
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
      />
    );
  }

  return null;
};

export default Index;

