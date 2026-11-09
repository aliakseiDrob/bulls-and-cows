const allValidChars = '0123456789abcdef';
export function createDigitValidator(base) {
    return (digit) => {
        if (digit.length !== 1)
            return false;
        const char = digit.toLowerCase();
        return allValidChars.slice(0, base).includes(char);
    };
}
