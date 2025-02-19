export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface DifficultyLevel {
  name: string;
  flagCount: number;
}

export const worldDifficulties: DifficultyLevel[] = [
  { name: "Easy", flagCount: 15 },
  { name: "Moderate", flagCount: 30 },
  { name: "Hard", flagCount: 50 },
  { name: "Extreme", flagCount: 254 }, // Assuming total world flags
];

export const usDifficulties: DifficultyLevel[] = [
  { name: "Easy", flagCount: 10 },
  { name: "Moderate", flagCount: 15 },
  { name: "Hard", flagCount: 25 },
  { name: "Extreme", flagCount: 50 },
];
