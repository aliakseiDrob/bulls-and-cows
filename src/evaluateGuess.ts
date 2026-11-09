export interface GuessResult {
  bulls: number;
  cows: number;
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const secretChars = secret.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');

  const bulls = guessChars.filter((char, index) => char === secretChars[index]).length;

  const cows = guessChars.filter(
    (char, index) => secretChars.includes(char) && char !== secretChars[index]
  ).length;

  return { bulls, cows };
}
