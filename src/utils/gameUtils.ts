import type { GameModifiers } from "@/types/game";
import { GameMode, Question } from "@/types";
import { Flag, flags } from "@/data/flags";

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
    flagCount: 254,
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
    flagCount: 50,
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

export async function generateQuestions(gameMode: GameMode): Promise<Question[]> {
  const questions: Question[] = [];
  const availableFlags = [...flags];
  const count = Math.min(gameMode.flagCount, flags.length);

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableFlags.length);
    const correctFlag = availableFlags.splice(randomIndex, 1)[0];

    // Generate wrong options
    const wrongOptions = getRandomFlags(availableFlags, 3)
      .map(flag => flag.name)
      .filter(name => name !== correctFlag.name);

    // Create options array with correct answer in random position
    const options = [...wrongOptions];
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    options.splice(correctAnswerIndex, 0, correctFlag.name);

    questions.push({
      flagUrl: correctFlag.url,
      options,
      correctAnswer: correctFlag.name,
      blurAmount: gameMode.modifiers?.blurAmount || 0
    });
  }

  return questions;
}

function getRandomFlags(flags: Flag[], count: number): Flag[] {
  const result: Flag[] = [];
  const availableFlags = [...flags];

  for (let i = 0; i < count && availableFlags.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableFlags.length);
    result.push(availableFlags.splice(randomIndex, 1)[0]);
  }

  return result;
}
