const CHARS = '0123456789abcdef';

export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random
): string {
  if (length < 0) {
    throw new Error('Length must be non-negative');
  }
  if (length > base) {
    throw new Error('Length cannot exceed base');
  }

  const initialPool = CHARS.slice(0, base).split('');

  const build = (currentResult: string, currentPool: readonly string[]): string => {
    if (currentResult.length === length) {
      return currentResult;
    }

    const index = Math.floor(random() * currentPool.length);
    const char = currentPool[index];
    const nextPool = currentPool.filter((_, idx) => idx !== index);

    return build(currentResult + char, nextPool);
  };

  return build('', initialPool);
}
