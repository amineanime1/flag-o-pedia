export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasAnswered: boolean;
  currentAnswer?: string;
}

export interface Room {
  id: string;
  password: string;
  players: Player[];
  gameState: 'waiting' | 'voting' | 'playing' | 'finished';
  votingState?: {
    mode: 'world' | 'us';
    gameMode: 'multiple' | 'type' | 'map';
    votes: {
      [playerId: string]: {
        mode: 'world' | 'us';
        gameMode: 'multiple' | 'type' | 'map';
      };
    };
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