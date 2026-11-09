import { Settings } from './state.js';

export type ScoreEntry = {
  readonly id: string;
  readonly name: string;
  readonly attempts: number;
  readonly duration: number;
  readonly settings: Settings;
  readonly date: number;
};

const LOCAL_STORAGE_KEY = 'b_c_leaderboard';
const TOP_N = 10;

export function loadScores(): readonly ScoreEntry[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNewScore(
  scores: readonly ScoreEntry[],
  entryData: Omit<ScoreEntry, 'id' | 'date'>
): readonly ScoreEntry[] {
  const newEntry: ScoreEntry = {
    ...entryData,
    id: Math.random().toString(36).slice(2, 9),
    date: Date.now(),
  };

  const updatedScores = [...scores, newEntry].sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    return a.duration - b.duration;
  });

  const topScores = updatedScores.slice(0, TOP_N);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topScores));
  return topScores;
}

export function isTopResult(
  scores: readonly ScoreEntry[],
  attempts: number,
  duration: number
): boolean {
  if (scores.length < TOP_N) {
    return true;
  }
  const lastScore = scores[scores.length - 1];
  if (attempts !== lastScore.attempts) {
    return attempts < lastScore.attempts;
  }
  return duration < lastScore.duration;
}
