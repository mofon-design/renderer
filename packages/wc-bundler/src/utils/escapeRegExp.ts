const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

export function escapeRegExp(string: string): string {
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}
