import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';
describe('countPossibleSecrets', () => {
    describe('Valid mathematical calculations', () => {
        it.each([
            { length: 0, base: 10, expected: 1 },
            { length: 1, base: 10, expected: 10 },
            { length: 1, base: 16, expected: 16 },
            { length: 2, base: 2, expected: 2 },
            { length: 4, base: 10, expected: 5040 },
            { length: 2, base: 16, expected: 240 },
        ])('should return $expected for length $length and base $base', ({ length, base, expected }) => {
            expect(countPossibleSecrets(length, base)).toBe(expected);
        });
        it('should be deterministic and return the same result from memoized cache on repeated calls', () => {
            const firstCall = countPossibleSecrets(4, 10);
            const secondCall = countPossibleSecrets(4, 10);
            expect(secondCall).toBe(firstCall);
        });
    });
    describe('Error handling for invalid arguments', () => {
        it('should throw an error when length exceeds base', () => {
            expect(() => countPossibleSecrets(5, 4)).toThrow();
        });
        it('should throw an error when length is negative', () => {
            expect(() => countPossibleSecrets(-1, 10)).toThrow();
        });
    });
});
