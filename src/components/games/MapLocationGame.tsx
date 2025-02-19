import { type Question, type GameHistory } from "@/types/game";
import { Home } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

interface MapLocationGameProps {
  mode: "world" | "us";
  questions: Question[];
  currentQuestion: number;
  score: number;
  isAnswered: boolean;
  gameHistory: GameHistory[];
  timeRemaining: number | null;
  onAnswer: (answer: string) => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

export function MapLocationGame({
  mode,
  questions,
  currentQuestion,
  score,
  isAnswered,
  gameHistory,
  timeRemaining,
  onAnswer,
  onBackToMenu,
  onPlayAgain
}: MapLocationGameProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Game Header */}
        <header className="text-center space-y-4">
          <button
            onClick={onBackToMenu}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <h1 className="text-4xl font-bold text-primary">
            {mode === "world" ? "World" : "US"} Flags Quiz - Map Mode
          </h1>
          
          <div className="flex justify-center items-center gap-4">
            <p className="text-xl text-muted-foreground">
              Score: {score}/{questions.length}
            </p>
            {timeRemaining !== null && (
              <p className="text-xl font-bold text-primary">
                Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        </header>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flag Display */}
          <div className="lg:col-span-1">
            <div className="aspect-video w-full">
              <img
                src={questions[currentQuestion].flagUrl}
                alt="Flag to identify"
                className="w-full h-full object-contain"
                style={questions[currentQuestion].blurAmount ? {
                  filter: `blur(${questions[currentQuestion].blurAmount}px)`
                } : undefined}
              />
            </div>
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2 aspect-[2/1] bg-card rounded-lg overflow-hidden">
            <ComposableMap>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => !isAnswered && onAnswer(geo.properties.name)}
                      style={{
                        default: {
                          fill: "#2A2A2A",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#404040",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#2A2A2A",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>
              {questions[currentQuestion].coordinates && (
                <Marker coordinates={questions[currentQuestion].coordinates}>
                  <circle r={8} fill="#FF4136" />
                </Marker>
              )}
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  );
} 