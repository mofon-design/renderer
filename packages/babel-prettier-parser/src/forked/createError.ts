import type { SourceLocation } from '@babel/types';

/** Construct an error similar to the ones thrown by Babel. */
export function createError(message: string, loc?: SourceLocation['start']): SyntaxError {
  const error = new SyntaxError(`${message} (${loc?.line || 0}:${(loc?.column || 0) + 1})`);
  return Object.assign(error, { loc });
}
