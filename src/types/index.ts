export interface GameMode {
  name: string;
  flagCount: number;
  modifiers?: {
    timeLimit?: number;
    blurAmount?: number;
    noDeathMode?: boolean;
  };
}

export interface Question {
  flagUrl: string;
  options: string[];
  correctAnswer: string;
  blurAmount: number;
} 