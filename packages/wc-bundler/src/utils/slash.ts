const SlashReplacePattern = /\\/g;
const SlashDetectPattern = /^\\\\\?\\/g;

export function slash(input: string): string {
  if (SlashDetectPattern.test(input)) {
    return input;
  }

  return input.replace(SlashReplacePattern, '/');
}
