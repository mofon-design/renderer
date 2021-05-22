import type { ParserOptions } from '@babel/parser';
import type { File, Node } from '@babel/types';
import { parse } from '@babel/parser';
import type { Options as PrettierOptions, Parser } from 'prettier';
import {
  createBabelParseError,
  createParser,
  postprocess,
  shouldRethrowRecoveredError,
} from './forked';

function babel(
  text: string,
  prettierOptions?: PrettierOptions,
  parserOptions?: ParserOptions,
): File {
  const sourceType =
    (prettierOptions as Record<string, unknown>)?.__babelSourceType === 'script'
      ? 'script'
      : 'module';
  const ast = parse(text, { ...parserOptions, sourceType }) as File & { errors?: unknown[] };
  const error = ast.errors?.find((error) => shouldRethrowRecoveredError(error));
  if (error) throw createBabelParseError(error);
  return postprocess(ast, text);
}

export function createBabelParser(
  text: string,
  parsers?: unknown,
  prettierOptions?: PrettierOptions,
): File;
export function createBabelParser(parserOptions: ParserOptions): Parser<Node>;
export function createBabelParser(
  arg0: string | ParserOptions,
  _arg1?: unknown,
  arg2?: PrettierOptions,
): Parser<Node> | File {
  if (typeof arg0 === 'string') return babel(arg0, arg2);

  return createParser(function wrapped(text, _parsers, prettierOptions) {
    return babel(text, prettierOptions, arg0);
  });
}

export default createBabelParser;
