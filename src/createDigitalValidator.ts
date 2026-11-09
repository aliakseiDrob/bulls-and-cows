const allValidChars = '0123456789abcdef';

export function createDigitValidator(base: number): (digit: string) => boolean {
  return (digit: string): boolean => {
    if (digit.length !== 1) return false;
    const char = digit.toLowerCase();
    return allValidChars.slice(0, base).includes(char);
  };
}
