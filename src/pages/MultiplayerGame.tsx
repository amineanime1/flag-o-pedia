import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Copy, Check } from "lucide-react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { GameModeVoting } from "@/components/multiplayer/GameModeVoting";
import { MultiplayerGameSummary } from "@/components/multiplayer/GameSummary";

interface JoinRoomForm {
  name: string;
  roomId: string;
  password: string;
}

interface CreateRoomForm {
  name: string;
  password: string;
}

export function MultiplayerGame() {
  const [view, setView] = useState<'menu' | 'create' | 'join' | 'room'>('menu');
  const [joinForm, setJoinForm] = useState<JoinRoomForm>({ name: '', roomId: '', password: '' });
  const [createForm, setCreateForm] = useState<CreateRoomForm>({ name: '', password: '' });
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { room, player, isConnected, createRoom, joinRoom, leaveRoom, startGame, vote } = useWebSocket();

  useEffect(() => {
    if (!isConnected) {
      // TODO: Show connection error toast
      navigate('/');
    }
  }, [isConnected, navigate]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoom(createForm.name, createForm.password);
      setView('room');
    } catch (error) {
      console.error('Error creating room:', error);
      // TODO: Show error toast
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinRoom(joinForm.name, joinForm.roomId, joinForm.password);
      setView('room');
    } catch (error) {
      console.error('Error joining room:', error);
      // TODO: Show error toast
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      navigate('/');
    } catch (error) {
      console.error('Error leaving room:', error);
      // TODO: Show error toast
    }
  };

  const copyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
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
            <Users className="w-8 h-8" />
            Multiplayer Mode
          </motion.h1>
        </header>

        {view === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setView('create')}
              className="w-full p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={() => setView('join')}
              className="w-full p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Join Room
            </button>
          </div>
        )}

        {view === 'create' && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
            onSubmit={handleCreateRoom}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full p-4 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Password</label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full p-4 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={4}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="flex-1 p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Room
              </button>
            </div>
          </motion.form>
        )}

        {view === 'join' && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
            onSubmit={handleJoinRoom}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <input
                type="text"
                value={joinForm.name}
                onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                className="w-full p-4 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room ID</label>
              <input
                type="text"
                value={joinForm.roomId}
                onChange={(e) => setJoinForm({ ...joinForm, roomId: e.target.value })}
                className="w-full p-4 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Password</label>
              <input
                type="password"
                value={joinForm.password}
                onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                className="w-full p-4 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="flex-1 p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Join Room
              </button>
            </div>
          </motion.form>
        )}

        {view === 'room' && room && player && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {room.gameState === 'waiting' && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Room Information</h2>
                  <button
                    onClick={copyRoomId}
                    className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    <span className="text-sm">{room.id}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Players</h3>
                    <div className="space-y-2">
                      {room.players.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg"
                        >
                          <span>{p.name} {p.isHost && '(Host)'}</span>
                          <span className="text-sm text-muted-foreground">Score: {p.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {player.isHost && (
                    <button
                      onClick={startGame}
                      className="w-full p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Start Game
                    </button>
                  )}
                </div>
              </div>
            )}

            {room.gameState === 'voting' && (
              <GameModeVoting
                room={room}
                player={player}
                onVote={vote}
              />
            )}

            {room.gameState === 'finished' && (
              <MultiplayerGameSummary
                room={room}
                player={player}
                onPlayAgain={startGame}
                onBackToMenu={handleLeaveRoom}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 