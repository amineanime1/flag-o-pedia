import type { GameModifiers } from "@/types/game";

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export interface DifficultyLevel {
  name: string;
  flagCount: number;
  modifiers?: GameModifiers;
}

export const worldDifficulties: DifficultyLevel[] = [
  {
    name: "Easy",
    flagCount: 10,
  },
  {
    name: "Medium",
    flagCount: 25,
  },
  {
    name: "Hard",
    flagCount: 50,
  },
  {
    name: "Expert",
    flagCount: 100,
  },
  {
    name: "No Death Mode",
    flagCount: 25,
    modifiers: {
      noDeath: true,
    },
  },
  {
    name: "Blurred - Easy",
    flagCount: 10,
    modifiers: {
      blurLevel: "light",
    },
  },
  {
    name: "Blurred - Hard",
    flagCount: 25,
    modifiers: {
      blurLevel: "heavy",
    },
  },
  {
    name: "2 Minute Challenge",
    flagCount: 100, // High count since it's time-limited
    modifiers: {
      timeLimit: 120, // 2 minutes in seconds
    },
  },
  {
    name: "Ultimate Challenge",
    flagCount: 50,
    modifiers: {
      noDeath: true,
      blurLevel: "medium",
      timeLimit: 180, // 3 minutes
    },
  },
];

export const usDifficulties: DifficultyLevel[] = [
  {
    name: "Easy",
    flagCount: 10,
  },
  {
    name: "Medium",
    flagCount: 25,
  },
  {
    name: "Hard",
    flagCount: 50,
  },
  {
    name: "No Death Mode",
    flagCount: 25,
    modifiers: {
      noDeath: true,
    },
  },
  {
    name: "Blurred - Easy",
    flagCount: 10,
    modifiers: {
      blurLevel: "light",
    },
  },
  {
    name: "Blurred - Hard",
    flagCount: 25,
    modifiers: {
      blurLevel: "heavy",
    },
  },
  {
    name: "2 Minute Challenge",
    flagCount: 50, // Fewer flags for US mode since it's more specific
    modifiers: {
      timeLimit: 120,
    },
  },
  {
    name: "Ultimate Challenge",
    flagCount: 25,
    modifiers: {
      noDeath: true,
      blurLevel: "medium",
      timeLimit: 180,
    },
  },
];

export function getBlurAmount(level: "none" | "light" | "medium" | "heavy"): number {
  switch (level) {
    case "light": return 2;
    case "medium": return 4;
    case "heavy": return 8;
    default: return 0;
  }
}
