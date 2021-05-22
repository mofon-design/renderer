import type { SourceLocation } from '@babel/types';
import { createError } from './createError';

export function createBabelParseError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return error;
  }

  // babel error prints (l:c) with cols that are zero indexed
  // so we need our custom error
  const loc = 'loc' in error ? (error as Record<'loc', SourceLocation['start']>).loc : undefined;

  return createError(error.message.replace(/ \(.*\)/, ''), loc);
}
