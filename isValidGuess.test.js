import { describe, it, expect } from 'vitest';
import { isValidGuess } from './isValidGuess.js';
describe('isValidGuess', () => {
    describe('Valid guesses', () => {
        it.each([
            { guess: '10', length: 2, base: 2 },
            { guess: '1234', length: 4, base: 10 },
            { guess: '012345', length: 6, base: 10 },
            { guess: '1a3f', length: 4, base: 16 },
            { guess: '1A3F', length: 4, base: 16 }, // регистронезависимость
        ])('should accept "$guess" for length $length and base $base', ({ guess, length, base }) => {
            expect(isValidGuess(guess, length, base)).toBe(true);
        });
    });
    describe('Invalid guesses', () => {
        it.each([
            { guess: '1', length: 2, base: 2, reason: 'too short' },
            { guess: '101', length: 2, base: 2, reason: 'too long' },
            { guess: '12', length: 2, base: 2, reason: 'digit out of bounds for base 2' },
            { guess: '123g', length: 4, base: 16, reason: 'invalid hex char' },
            { guess: '11', length: 2, base: 2, reason: 'duplicate digits' },
            { guess: '1223', length: 4, base: 10, reason: 'duplicate digits' },
            { guess: 'a1A2', length: 4, base: 16, reason: 'duplicate digits case-insensitively' },
        ])('should reject "$guess" ($reason)', ({ guess, length, base }) => {
            expect(isValidGuess(guess, length, base)).toBe(false);
        });
    });
});
