import { motion } from "framer-motion";
import { Trophy, RefreshCcw, Home, Share2 } from "lucide-react";
import { type Room, type Player } from "@/types/multiplayer";

interface MultiplayerGameSummaryProps {
  room: Room;
  player: Player;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function MultiplayerGameSummary({
  room,
  player,
  onPlayAgain,
  onBackToMenu,
}: MultiplayerGameSummaryProps) {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isWinner = player.id === winner.id;

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
        <div className="space-y-6">
          <div className="text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isWinner ? 'text-yellow-500' : 'text-primary'}`} />
            <h2 className="text-2xl font-bold text-primary">Game Over!</h2>
            {isWinner ? (
              <p className="text-lg text-yellow-500 font-semibold mt-2">You Won! 🎉</p>
            ) : (
              <p className="text-lg text-muted-foreground mt-2">
                {winner.name} won the game!
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Final Scores</h3>
            <div className="space-y-2">
              {sortedPlayers.map((p, index) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    p.id === player.id
                      ? 'bg-primary/10'
                      : 'bg-secondary/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <span className="font-bold">{p.score} points</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Game Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>Mode: {room.gameSettings?.mode === 'world' ? 'World Flags' : 'US States'}</div>
              <div>Type: {
                room.gameSettings?.gameMode === 'multiple'
                  ? 'Multiple Choice'
                  : room.gameSettings?.gameMode === 'type'
                    ? 'Type Answer'
                    : 'Map Location'
              }</div>
              <div>Questions: {room.questions?.length}</div>
              <div>Players: {room.players.length}</div>
            </div>
          </div>

          <div className="flex gap-4">
            {player.isHost ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPlayAgain}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Play Again
              </motion.button>
            ) : (
              <div className="flex-1 px-6 py-3 bg-secondary/20 text-muted-foreground rounded-lg text-center">
                Waiting for host...
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBackToMenu}
              className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all inline-flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Leave Room
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const text = `🎮 Flag-o-pedia Multiplayer\n🏆 Winner: ${winner.name}\n🎯 Score: ${winner.score} points\n🌍 Mode: ${
                room.gameSettings?.mode === 'world' ? 'World Flags' : 'US States'
              }\n🎲 Type: ${
                room.gameSettings?.gameMode === 'multiple'
                  ? 'Multiple Choice'
                  : room.gameSettings?.gameMode === 'type'
                    ? 'Type Answer'
                    : 'Map Location'
              }`;
              navigator.clipboard.writeText(text);
            }}
            className="w-full px-6 py-3 bg-secondary/20 text-secondary-foreground rounded-lg hover:bg-secondary/30 transition-all inline-flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
} 