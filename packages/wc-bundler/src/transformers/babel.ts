import type { BabelFileResult, TransformOptions } from '@babel/core';
import { transform } from '@babel/core';
import * as signale from 'signale';
import type { TransformCallback } from 'through2';
import type * as File from 'vinyl';
import { assertInstance } from '../utils';

export function createBabelTransformer(options: TransformOptions) {
  return function proxyBabelTransformer(
    chunk: File,
    enc: BufferEncoding,
    callback: TransformCallback,
  ): void {
    BabelTransformer(chunk, enc, callback, options);
  };
}

export function BabelTransformer(
  chunk: File,
  encode: BufferEncoding,
  callback: TransformCallback,
  options: TransformOptions,
): void {
  assertInstance(chunk.contents, Buffer);
  transform(chunk.contents.toString(encode), options, babelTransformCallback);

  function babelTransformCallback(error: unknown, result: BabelFileResult | null): void {
    if (error || !result?.code) {
      signale.error(`Transform failed: ${chunk.path}`);
      if (error) console.error(error);
      callback(error);
      return;
    }

    chunk.extname = '.js';
    chunk.contents = Buffer.from(result.code);
    callback(null, chunk);
  }
}
