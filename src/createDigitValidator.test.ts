import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './createDigitalValidator.js';

describe('createDigitValidator', () => {
  describe('Valid characters', () => {
    it.each([
      { base: 2, digits: ['0', '1'] },
      { base: 10, digits: ['0', '5', '9'] },
      { base: 16, digits: ['0', '9', 'a', 'A', 'b', 'B', 'f', 'F'] },
    ])('should accept valid digits for base $base', ({ base, digits }) => {
      const isValid = createDigitValidator(base);
      digits.forEach((digit) => {
        expect(isValid(digit)).toBe(true);
      });
    });
  });

  describe('Invalid characters outside the range', () => {
    it.each([
      { base: 2, digits: ['2', 'a', 'A'] },
      { base: 10, digits: ['a', 'b', 'F'] },
      { base: 16, digits: ['g', 'G', 'z'] },
    ])('should reject invalid digits for base $base', ({ base, digits }) => {
      const isValid = createDigitValidator(base);
      digits.forEach((digit) => {
        expect(isValid(digit)).toBe(false);
      });
    });
  });

  describe('Edge cases for input length', () => {
    it('should reject empty or multi-character strings', () => {
      const isValid = createDigitValidator(10);

      expect(isValid('')).toBe(false);
      expect(isValid('12')).toBe(false);
      expect(isValid('abc')).toBe(false);
    });
  });
});
