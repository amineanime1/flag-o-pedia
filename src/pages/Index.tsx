
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
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
  }
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        description: `That's the flag of ${answer}!`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${questions[currentQuestion].correctAnswer}`,
        duration: 2000,
      });
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 2000);
  };

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
          <div className="flex items-center justify-center space-x-2 text-lg font-medium">
            <span className="text-muted-foreground">Score:</span>
            <span className="text-primary">{score}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">{questions.length}</span>
          </div>
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
                  className={`w-full p-4 rounded-lg shadow-sm transition-colors duration-200 text-lg font-medium
                    ${
                      isAnswered && option === questions[currentQuestion].correctAnswer
                        ? "bg-green-500 text-white"
                        : isAnswered && option === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-white hover:bg-gray-50"
                    }
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion === questions.length - 1 && isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-primary mb-2">Game Complete!</h2>
            <p className="text-lg text-muted-foreground">
              Final Score: {score} out of {questions.length}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
