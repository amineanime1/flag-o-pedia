import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./providers/theme-provider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MultipleChoiceGame } from "./pages/MultipleChoiceGame";
import type { GameMode } from "@/types/game";
import { TypeAnswerGame } from "./pages/TypeAnswerGame";
// import { MapLocationGame } from "./pages/MapLocationGame";
import { MultiplayerGame } from "./pages/MultiplayerGame";
import Index from "./pages/Index";
import Stats from "./pages/Stats";

const queryClient = new QueryClient();

const App = () => {
  const gameMode = {
    name: "Multiple Choice",
    flagCount: 10,
    modifiers: {
      timeLimit: 120, // 2 minutes
      blurAmount: 0,
      noDeathMode: false
    }
  };

  return (
    <WebSocketProvider>
      <ThemeProvider defaultTheme="light" storageKey="flag-o-pedia-theme">
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
            <Route path="/" element={<Index />} />
              <Route path="/choice" element={<MultipleChoiceGame gameMode={gameMode} />} />
              {/* <Route path="/type" element={<TypeAnswerGame />} />
              <Route path="/map" element={<MapLocationGame />} /> */}
              <Route path="/multiplayer" element={<MultiplayerGame />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
};

export default App;
