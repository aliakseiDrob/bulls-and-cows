import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';
describe('evaluateGuess', () => {
    it.each([
        { secret: '1234', guess: '1234', expected: { bulls: 4, cows: 0 } },
        { secret: '1234', guess: '4321', expected: { bulls: 0, cows: 4 } },
        { secret: '1234', guess: '1325', expected: { bulls: 1, cows: 2 } },
        { secret: '1234', guess: '5678', expected: { bulls: 0, cows: 0 } },
        { secret: '0123', guess: '0123', expected: { bulls: 4, cows: 0 } },
    ])('should return correct bulls and cows for secret $secret and guess $guess', ({ secret, guess, expected }) => {
        expect(evaluateGuess(secret, guess)).toEqual(expected);
    });
    it('should be case-insensitive for hex digits', () => {
        expect(evaluateGuess('aBcD', 'AbCd')).toEqual({ bulls: 4, cows: 0 });
        expect(evaluateGuess('1a2f', 'f2a1')).toEqual({ bulls: 0, cows: 4 });
    });
});
