export interface GameResult {
  mode: 'world' | 'us';
  difficulty: string;
  score: number;
  total: number;
  date: string;
  gameMode?: string; // Add this line to include gameMode as an optional property
}

export function saveGameResult(result: Omit<GameResult, 'date'>) {
  const stats = getGameStats();
  const newResult = {
    ...result,
    date: new Date().toISOString()
  };
  stats.push(newResult);
  localStorage.setItem('flagopedia_stats', JSON.stringify(stats));
}

export function getGameStats(): GameResult[] {
  const stats = localStorage.getItem('flagopedia_stats');
  return stats ? JSON.parse(stats) : [];
}

export function clearGameStats() {
  localStorage.removeItem('flagopedia_stats');
}
