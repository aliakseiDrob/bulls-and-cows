import { evaluateGuess } from './evaluateGuess.js';
import { generateSecret } from './generateSecret.js';
import { isValidGuess } from './isValidGuess.js';

export type Settings = {
  readonly length: number;
  readonly base: number;
};

export type HistoryEntry = {
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
};

export type Status = 'idle' | 'playing' | 'won';

export type State = {
  readonly settings: Settings;
  readonly secret: string;
  readonly history: readonly HistoryEntry[];
  readonly startTime: number;
  readonly status: Status;
};

export function createInitialState(settings: Settings): State {
  return {
    settings,
    secret: '',
    history: [],
    startTime: 0,
    status: 'idle',
  };
}

export function startRound(state: State, random: () => number = Math.random): State {
  return {
    ...state,
    secret: generateSecret(state.settings.length, state.settings.base, random),
    history: [],
    startTime: Date.now(),
    status: 'playing',
  };
}

export function applyGuess(state: State, guess: string): State {
  if (state.status !== 'playing') {
    return state;
  }

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();
  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);

  if (isDuplicate) {
    return state;
  }

  const { bulls, cows } = evaluateGuess(state.secret, normalizedGuess);

  const entry: HistoryEntry = { guess: normalizedGuess, bulls, cows };
  const isWon = bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, entry],
    status: isWon ? 'won' : state.status,
  };
}

export function hasWon(state: State): boolean {
  return state.status === 'won';
}

export function getHistoryLength(state: State): number {
  return state.history.length;
}
