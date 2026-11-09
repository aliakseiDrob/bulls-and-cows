import { describe, it, expect } from 'vitest';
import { generateSecret } from './generateSecret.js';

describe('generateSecret', () => {
  describe('Successful generation scenarios', () => {
    it.each([
      { length: 0, base: 10, expectedLength: 0 },
      { length: 3, base: 10, expectedLength: 3 },
      { length: 6, base: 10, expectedLength: 6 },
    ])(
      'should return a string of the requested length ($length)',
      ({ length, base, expectedLength }) => {
        expect(generateSecret(length, base, () => 0.5)).toHaveLength(expectedLength);
      }
    );

    it('should return only unique digits', () => {
      const secret = generateSecret(4, 10, () => 0.5);
      expect(new Set(secret).size).toBe(secret.length);
    });

    it.each([
      { length: 4, base: 10, regex: /^[0-9]+$/ },
      { length: 4, base: 16, regex: /^[0-9a-f]+$/i },
      { length: 2, base: 2, regex: /^[01]+$/ },
    ])('should use only valid characters for base $base', ({ length, base, regex }) => {
      expect(generateSecret(length, base, () => 0.5)).toMatch(regex);
    });

    it('should be completely deterministic and allow leading zeros', () => {
      const mockRandomZero = () => 0;
      expect(generateSecret(4, 10, mockRandomZero)).toBe('0123');
    });

    it('should return all available characters when length equals base', () => {
      expect(generateSecret(2, 2, () => 0)).toBe('01');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should throw an error when length exceeds base', () => {
      expect(() => generateSecret(5, 4, () => 0.5)).toThrow();
    });

    it('should throw an error when length is negative', () => {
      expect(() => generateSecret(-1, 10, () => 0.5)).toThrow();
    });
  });
});
