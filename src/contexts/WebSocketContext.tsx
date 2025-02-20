import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WebSocketService } from '@/services/websocket';
import { type Room, type Player } from '@/types/multiplayer';

interface WebSocketContextType {
  room: Room | null;
  player: Player | null;
  isConnected: boolean;
  createRoom: (name: string, password: string) => Promise<void>;
  joinRoom: (name: string, roomId: string, password: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  startGame: () => Promise<void>;
  vote: (mode: 'world' | 'us', gameMode: 'multiple' | 'type' | 'map') => Promise<void>;
  submitAnswer: (answer: string, timeSpent: number) => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const ws = new WebSocketService('ws://localhost:3001'); // Replace with your WebSocket server URL

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    ws.connect()
      .then(() => setIsConnected(true))
      .catch(console.error);

    ws.on('game_state', (payload: { room: Room }) => {
      setRoom(payload.room);
    });

    ws.on('error', (payload: { message: string }) => {
      console.error('WebSocket error:', payload.message);
      // TODO: Show error toast
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  const createRoom = useCallback(async (name: string, password: string) => {
    ws.createRoom({ name, score: 0, isHost: true, hasAnswered: false }, password);
  }, []);

  const joinRoom = useCallback(async (name: string, roomId: string, password: string) => {
    ws.joinRoom({ name, score: 0, isHost: false, hasAnswered: false }, roomId, password);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (room && player) {
      ws.leaveRoom(player.id, room.id);
      setRoom(null);
      setPlayer(null);
    }
  }, [room, player]);

  const startGame = useCallback(async () => {
    if (room && player?.isHost) {
      ws.startGame(room.id);
    }
  }, [room, player]);

  const vote = useCallback(async (mode: 'world' | 'us', gameMode: 'multiple' | 'type' | 'map') => {
    if (room && player) {
      ws.vote(room.id, player.id, mode, gameMode);
    }
  }, [room, player]);

  const submitAnswer = useCallback(async (answer: string, timeSpent: number) => {
    if (room && player) {
      ws.submitAnswer(room.id, player.id, answer, timeSpent);
    }
  }, [room, player]);

  return (
    <WebSocketContext.Provider
      value={{
        room,
        player,
        isConnected,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        vote,
        submitAnswer,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
} 