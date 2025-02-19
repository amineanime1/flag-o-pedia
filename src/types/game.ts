export interface Question {
  flagUrl: string;
  correctAnswer: string;
  aliases?: string[];
  options?: string[];
  coordinates?: [number, number];
  blurAmount?: number;
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
  gameMode: "multiple" | "type" | "map" | null;
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
  gameMode: "multiple" | "type" | "map";
  difficulty: string;
  score: number;
  total: number;
  date?: number;
  modifiers?: GameModifiers;
  timeRemaining?: number;
  perfectRun?: boolean;
} 