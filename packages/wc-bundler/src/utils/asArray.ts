export function asArray<T>(pattern: T | T[]): T[];
export function asArray<T>(pattern: T | readonly T[]): readonly T[];
export function asArray<T>(pattern: T | readonly T[]): readonly T[] {
  return Array.isArray(pattern) ? pattern : [pattern];
}
