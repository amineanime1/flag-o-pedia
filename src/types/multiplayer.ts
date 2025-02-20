import { WebSocket } from 'ws';

export interface Player {
  id: string;
  name: string;
  ws: WebSocket;
  score: number;
  hasAnswered: boolean;
  isHost: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl: string;
  results?: Record<string, {
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

export interface Room {
  id: string;
  password: string;
  players: Player[];
  gameState: 'waiting' | 'voting' | 'playing' | 'finished';
  votingState?: {
    votes: Record<string, {
      mode: 'world' | 'us';
      gameMode: 'multiple' | 'type' | 'map';
    }>;
  };
  gameSettings?: {
    mode: 'world' | 'us';
    gameMode: 'multiple' | 'type' | 'map';
    timePerQuestion: number;
    totalQuestions: number;
  };
  currentQuestion?: number;
  questions?: Question[];
  timeRemaining?: number;
  timer?: NodeJS.Timeout;
}

export type GameMode = 'multiple' | 'type' | 'map';
export type GameRegion = 'world' | 'us';

export interface GameSettings {
  mode: GameRegion;
  gameMode: GameMode;
  timePerQuestion: number;
  totalQuestions: number;
}

export interface VotingState {
  mode: GameRegion;
  gameMode: GameMode;
  votes: {
    [playerId: string]: {
      mode: GameRegion;
      gameMode: GameMode;
    };
  };
}

export interface MultiplayerGameState {
  room: Room | null;
  player: Player | null;
}