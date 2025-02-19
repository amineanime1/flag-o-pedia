import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { Home, SkipForward, Trophy, Maximize2, Minimize2, Info, X } from "lucide-react";
import type { Question, GameHistory } from "@/types/game";
import { GameSummary } from "@/components/GameSummary";
import { ThemeToggle } from "@/components/ThemeToggle";

// Use a simpler, more reliable map source
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  useEffect(() => {
    setShowAnswer(false);
    setSelectedLocation(null);
  }, [currentQuestion]);

  const handleClick = useCallback((geo: any) => {
    if (isAnswered || showAnswer) return;

    const countryName = geo.properties.name;
    const coordinates: [number, number] = [
      geo.properties.longitude || 0,
      geo.properties.latitude || 0,
    ];

    setSelectedLocation(coordinates);
    setShowAnswer(true);

    const isCorrect = countryName.toLowerCase() === questions[currentQuestion].correctAnswer.toLowerCase();
    onAnswer(countryName);
  }, [currentQuestion, isAnswered, onAnswer, questions, showAnswer]);

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

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

  const getCountryColor = (geo: any) => {
    const countryName = geo.properties.name.toLowerCase();
    const isCurrentAnswer = countryName === questions[currentQuestion].correctAnswer.toLowerCase();
    
    // Check if this country was in previous questions
    const previousQuestion = gameHistory.find(q => 
      q.correctAnswer.toLowerCase() === countryName
    );

    if (showAnswer && isCurrentAnswer) {
      return "#22c55e"; // Correct answer (green)
    } else if (previousQuestion) {
      if (!previousQuestion.userAnswer) {
        return "#94a3b8"; // Skipped questions (gray)
      } else if (previousQuestion.userAnswer.toLowerCase() === countryName) {
        return previousQuestion.userAnswer.toLowerCase() === previousQuestion.correctAnswer.toLowerCase()
          ? "#86efac" // Correctly answered (light green)
          : "#fca5a5"; // Incorrectly answered (light red)
      }
    }
    
    return "#64748b"; // Default color
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'min-h-screen'}`}>
      {/* Top Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Menu</span>
          </button>

          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2 bg-card px-3 py-1 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-medium">{score}/{questions.length}</span>
            </motion.div>
            
            <motion.div 
              className="bg-card px-3 py-1 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <span className="text-sm">Question {currentQuestion + 1}/{questions.length}</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Current Flag - New Design */}
      <AnimatePresence>
        {!showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/20 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.div
                className="relative bg-card border border-border rounded-lg overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="relative aspect-[3/2] w-[300px] sm:w-[400px]">
                  <img
                    src={questions[currentQuestion].flagUrl}
                    alt="Flag to guess"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-4 text-center bg-card/95">
                  <p className="text-lg font-medium text-primary">
                    Click on the map to locate this flag's country
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="w-full h-screen bg-[#1B2A4A] dark:bg-[#0A1628]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150
          }}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={4}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(geo)}
                    style={{
                      default: {
                        fill: getCountryColor(geo),
                        stroke: "#1f2937",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms",
                      },
                      hover: {
                        fill: "#94a3b8",
                        stroke: "#1f2937",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                        filter: "brightness(1.1)",
                      },
                      pressed: {
                        fill: "#64748b",
                        stroke: "#1f2937",
                        strokeWidth: 1,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
            {selectedLocation && (
              <Marker coordinates={selectedLocation}>
                <g transform="translate(-12, -24)">
                  <path
                    d="M12 0c-4.4 0-8 3.6-8 8s8 16 8 16 8-11.6 8-16-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </g>
              </Marker>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Answer Overlay */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/40 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card p-8 rounded-lg shadow-2xl max-w-md mx-4"
            >
              <div className="relative w-full aspect-[3/2] mb-6 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={questions[currentQuestion].flagUrl}
                  alt={questions[currentQuestion].correctAnswer}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-xl font-medium text-muted-foreground mb-2">
                The correct country was:
              </h3>
              <p className="text-4xl font-bold text-primary mb-6">
                {questions[currentQuestion].correctAnswer}
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
                  onClick={() => setShowAnswer(false)}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-t border-border"
      >
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              disabled={position.zoom <= 1}
            >
              -
            </button>
            <div className="w-20 h-1 bg-secondary rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((position.zoom - 1) / 3) * 100}%` }}
              />
            </div>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              disabled={position.zoom >= 4}
            >
              +
            </button>
          </div>

          <button
            onClick={onSkipQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
            disabled={isAnswered || showAnswer}
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip</span>
          </button>
        </div>
      </motion.div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
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
                <h2 className="text-xl font-bold">How to Play</h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Click on the country you think matches the displayed flag.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
                    <span>Correct Answer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#94a3b8]" />
                    <span>Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#86efac]" />
                    <span>Previously Correct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#fca5a5]" />
                    <span>Previously Wrong</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 