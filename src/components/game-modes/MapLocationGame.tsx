import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { Home, SkipForward } from "lucide-react";
import type { Question, GameHistory } from "@/types/game";
import { GameSummary } from "@/components/GameSummary";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ZOOM_THRESHOLD = 2000; // Distance threshold for correct answers in kilometers

interface MapLocationGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  gameHistory: GameHistory[];
  onAnswer: (answer: string) => void;
  onSkipQuestion: () => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

export function MapLocationGame({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  gameHistory,
  onAnswer,
  onSkipQuestion,
  onBackToMenu,
  onPlayAgain,
}: MapLocationGameProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClick = useCallback((geo: any) => {
    if (isAnswered || showAnswer) return;

    const countryName = geo.properties.name;
    const coordinates: [number, number] = [
      geo.properties.longitude || 0,
      geo.properties.latitude || 0,
    ];

    setSelectedLocation(coordinates);
    setShowAnswer(true);

    // Check if the clicked country matches the correct answer
    const isCorrect = countryName.toLowerCase() === questions[currentQuestion].correctAnswer.toLowerCase();
    onAnswer(countryName);
  }, [currentQuestion, isAnswered, onAnswer, questions, showAnswer]);

  if (isAnswered && currentQuestion === questions.length) {
    return (
      <GameSummary
        score={score}
        total={questions.length}
        onPlayAgain={onPlayAgain}
        gameMode="map"
        mode={mode}
        questions={gameHistory}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Menu
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-sm text-muted-foreground">Score: {score}</p>
        </div>
        <button
          onClick={onSkipQuestion}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          disabled={isAnswered || showAnswer}
        >
          <SkipForward className="w-5 h-5" />
          Skip
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-center mb-6">
          <img
            src={questions[currentQuestion].flagUrl}
            alt="Flag to guess"
            className="h-32 object-cover rounded-lg shadow-md"
          />
        </div>
        
        <p className="text-center text-lg mb-4">
          Click on the map where you think this country is located
        </p>

        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-border">
          <ComposableMap projection="geoMercator">
            <ZoomableGroup center={[0, 0]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleClick(geo)}
                      style={{
                        default: {
                          fill: showAnswer
                            ? geo.properties.name.toLowerCase() ===
                              questions[currentQuestion].correctAnswer.toLowerCase()
                              ? "#22c55e"
                              : "#64748b"
                            : "#64748b",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#94a3b8",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#64748b",
                          stroke: "#1f2937",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-lg font-semibold">
              The correct country was:{" "}
              <span className="text-primary">{questions[currentQuestion].correctAnswer}</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 