export function evaluateGuess(secret, guess) {
    const secretChars = secret.toLowerCase().split('');
    const guessChars = guess.toLowerCase().split('');
    const bulls = guessChars.filter((char, index) => char === secretChars[index]).length;
    const cows = guessChars.filter((char, index) => secretChars.includes(char) && char !== secretChars[index]).length;
    return { bulls, cows };
}
