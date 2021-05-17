export function json(input: unknown): string {
  return JSON.stringify(input, null, 2);
}
