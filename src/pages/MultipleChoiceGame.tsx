import { motion } from "framer-motion";
import { Timer } from "@/components/Timer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimeUpPopup } from "@/components/TimeUpPopup";
import { GameMode } from "@/types";
import { generateQuestions } from "@/utils/gameUtils";

interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
  blurAmount: number;
}

export function MultipleChoiceGame({ gameMode }: { gameMode: GameMode }) {
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    gameMode.modifiers?.timeLimit || null
  );
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    const newQuestions = await generateQuestions(gameMode);
    setQuestions(newQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, [gameMode]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setShowTimeUpPopup(true);
    }
  }, [timeRemaining]);

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowTimeUpPopup(true);
    }
  };

  const handlePlayAgain = () => {
    setShowTimeUpPopup(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeRemaining(gameMode.modifiers?.timeLimit || null);
    fetchQuestions();
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  if (!questions.length) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold">
            Score: {score}/{questions.length}
          </div>
          {timeRemaining !== null && (
            <Timer timeRemaining={timeRemaining} />
          )}
        </div>

        <div className="bg-card rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-full flex justify-center">
              <img
                src={questions[currentQuestion].flagUrl}
                alt="Flag to guess"
                className="max-w-full max-h-[300px] w-auto h-auto object-contain"
                style={{
                  filter: `blur(${questions[currentQuestion].blurAmount}px)`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 text-lg bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                disabled={showTimeUpPopup}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showTimeUpPopup && (
        <TimeUpPopup
          score={score}
          total={questions.length}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
} 