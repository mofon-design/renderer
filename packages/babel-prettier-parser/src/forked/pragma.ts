import { parseWithComments, strip, extract, print } from 'jest-docblock';
import { getShebang, normalizeEndOfLine } from './utils';

function parseDocBlock(text: string) {
  const shebang = getShebang(text);
  if (shebang) text = text.slice(shebang.length + 1);

  const docBlock = extract(text);
  const { pragmas, comments } = parseWithComments(docBlock);

  return { shebang, text, pragmas, comments };
}

export function hasPragma(text: string): boolean {
  const pragmas = Object.keys(parseDocBlock(text).pragmas);
  return pragmas.includes('prettier') || pragmas.includes('format');
}

export function insertPragma(originalText: string): string {
  const { shebang, text, pragmas, comments } = parseDocBlock(originalText);

  const strippedText = strip(text);
  const docBlock = print({ pragmas: { format: '', ...pragmas }, comments: comments.trimStart() });

  return (
    (shebang ? `${shebang}\n` : '') +
    // normalise newlines (mitigate use of os.EOL by jest-docblock)
    normalizeEndOfLine(docBlock) +
    (strippedText.startsWith('\n') ? '\n' : '\n\n') +
    strippedText
  );
}
