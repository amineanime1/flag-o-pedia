export interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
  aliases?: string[];
}

export interface GameHistory {
  flagUrl: string;
  correctAnswer: string;
  userAnswer?: string;
}

export interface GameState {
  mode: "world" | "us" | null;
  gameMode: "multiple" | "type" | null;
  difficulty: DifficultyLevel | null;
}

export interface DifficultyLevel {
  name: string;
  flagCount: number;
} 