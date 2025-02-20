export type GameMode = "multiple" | "type" | "map";

export interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  image?: string;
  results?: {
    [playerId: string]: {
      answer: string;
      isCorrect: boolean;
      timeSpent: number;
    };
  };
}

export interface GameHistory {
  flagUrl: string;
  correctAnswer: string;
  userAnswer?: string;
  coordinates?: [number, number];
  timeSpent?: number;
}

export interface GameState {
  mode: "world" | "us" | null;
  gameMode: GameMode | null;
  difficulty: {
    name: string;
    flagCount: number;
    modifiers?: GameModifiers;
  } | null;
}

export interface GameModifiers {
  noDeath?: boolean;
  blurLevel?: "none" | "light" | "medium" | "heavy";
  timeLimit?: number; // in seconds
}

export interface GameResult extends GameHistory {
  mode: "world" | "us";
  gameMode: GameMode;
  difficulty: string;
  score: number;
  total: number;
  date?: number;
  modifiers?: GameModifiers;
  timeRemaining?: number;
  perfectRun?: boolean;
}