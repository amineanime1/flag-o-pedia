import { WebSocket } from 'ws';
import { Question } from './game';

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasAnswered: boolean;
  ws: WebSocket;
  currentAnswer?: string;
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

export interface Room {
  id: string;
  password: string;
  players: Player[];
  gameState: 'waiting' | 'voting' | 'playing' | 'finished';
  votingState?: VotingState;
  gameSettings?: GameSettings;
  currentQuestion?: number;
  questions?: Question[];
  timeRemaining?: number;
  timer?: NodeJS.Timeout;
}

export interface MultiplayerGameState {
  room: Room | null;
  player: Player | null;
}

export interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
  blurAmount: number;
  results?: {
    [playerId: string]: {
      answer: string;
      isCorrect: boolean;
      timeSpent: number;
    };
  };
} 