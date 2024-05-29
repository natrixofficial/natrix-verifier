export const valueHashValidator = (valueHash: string): boolean => /^[\da-z]{128}$/.test(valueHash);
