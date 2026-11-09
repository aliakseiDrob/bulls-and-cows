import { createDigitValidator } from './createDigitalValidator.js';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) return false;

  const lowerGuess = guess.toLowerCase();
  const chars = lowerGuess.split('');

  const uniqueChars = new Set(chars);
  if (uniqueChars.size !== length) return false;

  const isDigitValid = createDigitValidator(base);
  return chars.every(isDigitValid);
}
