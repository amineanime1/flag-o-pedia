import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Globe, Map, CheckCircle2, XCircle, Trophy, PlayCircle, RefreshCcw } from "lucide-react";

interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
}

const worldFlags: Question[] = [
  {
    flagUrl: "https://flagcdn.com/w640/fr.png",
    options: ["France", "Netherlands", "Luxembourg", "Russia"],
    correctAnswer: "France"
  },
  {
    flagUrl: "https://flagcdn.com/w640/jp.png",
    options: ["China", "Japan", "South Korea", "Vietnam"],
    correctAnswer: "Japan"
  },
  {
    flagUrl: "https://flagcdn.com/w640/br.png",
    options: ["Argentina", "Brazil", "Colombia", "Uruguay"],
    correctAnswer: "Brazil"
  },
  {
    flagUrl: "https://flagcdn.com/w640/de.png",
    options: ["Belgium", "Germany", "Netherlands", "Austria"],
    correctAnswer: "Germany"
  },
  {
    flagUrl: "https://flagcdn.com/w640/it.png",
    options: ["Spain", "Italy", "Greece", "Portugal"],
    correctAnswer: "Italy"
  },
  {
    flagUrl: "https://flagcdn.com/w640/au.png",
    options: ["New Zealand", "Australia", "Fiji", "Samoa"],
    correctAnswer: "Australia"
  },
  {
    flagUrl: "https://flagcdn.com/w640/ca.png",
    options: ["United States", "Canada", "Mexico", "Norway"],
    correctAnswer: "Canada"
  },
  {
    flagUrl: "https://flagcdn.com/w640/in.png",
    options: ["Pakistan", "India", "Bangladesh", "Sri Lanka"],
    correctAnswer: "India"
  }
];

const usFlags: Question[] = [
  {
    flagUrl: "https://flagcdn.com/w640/us-ca.png",
    options: ["Texas", "California", "Florida", "New York"],
    correctAnswer: "California"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-tx.png",
    options: ["Arizona", "New Mexico", "Texas", "Oklahoma"],
    correctAnswer: "Texas"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-ny.png",
    options: ["New York", "Massachusetts", "Pennsylvania", "Connecticut"],
    correctAnswer: "New York"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-fl.png",
    options: ["Georgia", "Florida", "Alabama", "South Carolina"],
    correctAnswer: "Florida"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-ak.png",
    options: ["Montana", "Alaska", "Maine", "Washington"],
    correctAnswer: "Alaska"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-hi.png",
    options: ["Hawaii", "Puerto Rico", "Guam", "American Samoa"],
    correctAnswer: "Hawaii"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-co.png",
    options: ["Arizona", "New Mexico", "Colorado", "Utah"],
    correctAnswer: "Colorado"
  },
  {
    flagUrl: "https://flagcdn.com/w640/us-ma.png",
    options: ["Rhode Island", "Massachusetts", "New Hampshire", "Maine"],
    correctAnswer: "Massachusetts"
  }
];

const generateWorldFlags = (count: number): Question[] => {
  // This is just a subset of available flags. You can add more following the same pattern
  const allWorldFlags: Question[] = [
    {
      flagUrl: "https://flagcdn.com/w640/fr.png",
      options: ["France", "Netherlands", "Luxembourg", "Russia"],
      correctAnswer: "France"
    },
    {
      flagUrl: "https://flagcdn.com/w640/jp.png",
      options: ["China", "Japan", "South Korea", "Vietnam"],
      correctAnswer: "Japan"
    },
    {
      flagUrl: "https://flagcdn.com/w640/br.png",
      options: ["Argentina", "Brazil", "Colombia", "Uruguay"],
      correctAnswer: "Brazil"
    },
    {
      flagUrl: "https://flagcdn.com/w640/de.png",
      options: ["Belgium", "Germany", "Netherlands", "Austria"],
      correctAnswer: "Germany"
    },
    {
      flagUrl: "https://flagcdn.com/w640/it.png",
      options: ["Spain", "Italy", "Greece", "Portugal"],
      correctAnswer: "Italy"
    },
    {
      flagUrl: "https://flagcdn.com/w640/au.png",
      options: ["New Zealand", "Australia", "Fiji", "Samoa"],
      correctAnswer: "Australia"
    },
    {
      flagUrl: "https://flagcdn.com/w640/ca.png",
      options: ["United States", "Canada", "Mexico", "Norway"],
      correctAnswer: "Canada"
    },
    {
      flagUrl: "https://flagcdn.com/w640/in.png",
      options: ["Pakistan", "India", "Bangladesh", "Sri Lanka"],
      correctAnswer: "India"
    },
    // Adding more flags
    {
      flagUrl: "https://flagcdn.com/w640/es.png",
      options: ["Spain", "Portugal", "Italy", "Greece"],
      correctAnswer: "Spain"
    },
    {
      flagUrl: "https://flagcdn.com/w640/kr.png",
      options: ["Japan", "China", "South Korea", "Vietnam"],
      correctAnswer: "South Korea"
    },
    // Add more flags here...
  ];
  
  // Shuffle and return requested number of flags
  return allWorldFlags.sort(() => Math.random() - 0.5).slice(0, count);
};

const generateUSFlags = (count: number): Question[] => {
  // Return requested number of US state flags
  return usFlags.sort(() => Math.random() - 0.5).slice(0, count);
};

const getDifficultyFlags = (mode: "world" | "us", difficulty: string) => {
  if (mode === "world") {
    switch (difficulty) {
      case "easy":
        return generateWorldFlags(15);
      case "medium":
        return generateWorldFlags(30);
      case "hard":
        return generateWorldFlags(50);
      case "extreme":
        return generateWorldFlags(100); // or however many flags we have
      default:
        return generateWorldFlags(15);
    }
  } else {
    switch (difficulty) {
      case "easy":
        return generateUSFlags(10);
      case "medium":
        return generateUSFlags(15);
      case "hard":
        return generateUSFlags(25);
      case "extreme":
        return generateUSFlags(50);
      default:
        return generateUSFlags(10);
    }
  }
};

interface GameMode {
  id: "world" | "us";
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface Difficulty {
  id: string;
  title: string;
  description: string;
  flagCount: number;
}

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameMode, setGameMode] = useState<"world" | "us" | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const handleGameStart = (mode: "world" | "us", diff: string) => {
    const newQuestions = getDifficultyFlags(mode, diff);
    setGameMode(mode);
    setDifficulty(diff);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    toast({
      title: `Starting ${mode === "world" ? "World" : "US State"} Flags - ${diff.charAt(0).toUpperCase() + diff.slice(1)}`,
      description: "Good luck! 🍀",
      duration: 2000,
    });
  };

    const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast({
        title: "🎉 Correct!",
        description: `That's the flag of ${answer}!`,
        duration: 2000,
      });
    } else {
      toast({
        title: "❌ Incorrect",
        description: `The correct answer was ${questions[currentQuestion].correctAnswer}`,
        duration: 2000,
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 2000);
  };

  const handlePlayAgain = () => {
    setGameMode(null);
    setDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    toast({
      title: "Ready for another round?",
      description: "Choose your challenge! 🌟",
      duration: 2000,
    });
  };

  if (!gameMode) {
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
              Choose your category:
            </motion.p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-lg bg-white shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Globe className="w-12 h-12 text-primary" />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">World Flags</h2>
                    <p className="text-muted-foreground mb-4">Test your knowledge of country flags</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    <button
                      onClick={() => handleGameStart("world", "easy")}
                      className="w-full p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Easy (15 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("world", "medium")}
                      className="w-full p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                    >
                      Medium (30 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("world", "hard")}
                      className="w-full p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Hard (50 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("world", "extreme")}
                      className="w-full p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      Extreme (All flags)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-lg bg-white shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Map className="w-12 h-12 text-primary" />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">US State Flags</h2>
                    <p className="text-muted-foreground mb-4">Challenge yourself with US states</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    <button
                      onClick={() => handleGameStart("us", "easy")}
                      className="w-full p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Easy (10 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("us", "medium")}
                      className="w-full p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                    >
                      Medium (15 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("us", "hard")}
                      className="w-full p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Hard (25 flags)
                    </button>
                    <button
                      onClick={() => handleGameStart("us", "extreme")}
                      className="w-full p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      All States (50 flags)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

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
            className="text-4xl font-bold text-primary flex items-center justify-center gap-3"
          >
            {gameMode === "world" ? <Globe className="w-8 h-8" /> : <Map className="w-8 h-8" />}
            {gameMode === "world" ? "World Flags" : "US State Flags"}
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
            <span className="text-primary">{questions.length}</span>
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
                src={questions[currentQuestion].flagUrl}
                alt="Flag"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg shadow-sm transition-colors duration-200 text-lg font-medium flex items-center justify-between
                    ${
                      isAnswered && option === questions[currentQuestion].correctAnswer
                        ? "bg-green-500 text-white"
                        : isAnswered && option === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-white hover:bg-gray-50"
                    }
                  `}
                >
                  <span>{option}</span>
                  {isAnswered && option === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {isAnswered && option === selectedAnswer && option !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="w-5 h-5" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion === questions.length - 1 && isAnswered && (
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
                Final Score: {score} out of {questions.length}
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
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
