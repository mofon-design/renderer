export function getNextNonSpaceNonCommentCharacter<T>(
  text: string,
  node: T,
  locEnd: (node: T) => number,
): string {
  return text.charAt(getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd) || 0);
}

function getNextNonSpaceNonCommentCharacterIndex<T>(
  text: string,
  node: T,
  locEnd: (node: T) => number,
): number | false {
  return getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, locEnd(node));
}

function getNextNonSpaceNonCommentCharacterIndexWithStartIndex(
  text: string,
  idx: number | false,
): number | false {
  let nextIdx: number | false = idx;
  let oldIdx: number | false | null = null;

  while (nextIdx !== oldIdx) {
    oldIdx = nextIdx;
    nextIdx = skipSpaces(text, nextIdx);
    nextIdx = skipInlineComment(text, nextIdx);
    nextIdx = skipTrailingComment(text, nextIdx);
    nextIdx = skipNewline(text, nextIdx);
  }
  return nextIdx;
}

export function getShebang(text: string): string {
  if (!text.startsWith('#!')) return '';

  const index = text.indexOf('\n');
  return index < 0 ? text : text.slice(0, index);
}

export function normalizeEndOfLine(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

interface SkipOptions {
  backwards?: boolean;
}

function skip(chars: string | RegExp) {
  return (text: string, index: number | false, opts: SkipOptions = {}): number | false => {
    const { backwards } = opts;

    // Allow `skip` functions to be threaded together without having
    // to check for failures (did someone say monads?).
    /* istanbul ignore next */
    if (index === false) {
      return false;
    }

    const { length } = text;
    let cursor = index;
    while (cursor >= 0 && cursor < length) {
      const c = text.charAt(cursor);
      if (chars instanceof RegExp) {
        if (!chars.test(c)) {
          return cursor;
        }
      } else if (!chars.includes(c)) {
        return cursor;
      }

      backwards ? cursor-- : cursor++;
    }

    if (cursor === -1 || cursor === length) {
      // If we reached the beginning or end of the file, return the
      // out-of-bounds cursor. It's up to the caller to handle this
      // correctly. We don't want to indicate `false` though if it
      // actually skipped valid characters.
      return cursor;
    }

    return false;
  };
}

const skipEverythingButNewLine = skip(/[^\n\r]/);

function skipInlineComment(text: string, index: number | false): number | false {
  /* istanbul ignore next */
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === '/' && text.charAt(index + 1) === '*') {
    for (let i = index + 2; i < text.length; ++i) {
      if (text.charAt(i) === '*' && text.charAt(i + 1) === '/') {
        return i + 2;
      }
    }
  }
  return index;
}

// This one doesn't use the above helper function because it wants to
// test \r\n in order and `skip` doesn't support ordering and we only
// want to skip one newline. It's simple to implement.
function skipNewline(text: string, index: number | false, opts: SkipOptions = {}): number | false {
  if (index === false) {
    return false;
  }

  const atIndex = text.charAt(index);
  if (opts?.backwards) {
    // We already replace `\r\n` with `\n` before parsing
    /* istanbul ignore next */
    if (text.charAt(index - 1) === '\r' && atIndex === '\n') {
      return index - 2;
    }
    if (atIndex === '\n' || atIndex === '\r' || atIndex === '\u2028' || atIndex === '\u2029') {
      return index - 1;
    }
  } else {
    // We already replace `\r\n` with `\n` before parsing
    /* istanbul ignore next */
    if (atIndex === '\r' && text.charAt(index + 1) === '\n') {
      return index + 2;
    }
    if (atIndex === '\n' || atIndex === '\r' || atIndex === '\u2028' || atIndex === '\u2029') {
      return index + 1;
    }
  }

  return index;
}

const skipSpaces = skip(' \t');

function skipTrailingComment(text: string, index: number | false): number | false {
  /* istanbul ignore next */
  if (index === false) {
    return false;
  }

  if (text.charAt(index) === '/' && text.charAt(index + 1) === '/') {
    return skipEverythingButNewLine(text, index);
  }
  return index;
}
