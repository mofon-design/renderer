import type { BabelFileResult, TransformOptions } from '@babel/core';
import { transform } from '@babel/core';
import type { Transform } from 'stream';
import type { TransformCallback } from 'through2';
import { obj } from 'through2';
import type File from 'vinyl';
import { assertInstance, signale } from '../utils';

export function createBabelPipeline(options: TransformOptions): Transform {
  return obj(function proxyBabelTransformer(
    chunk: File,
    encode: BufferEncoding,
    callback: TransformCallback,
  ): void {
    BabelTransformer(chunk, encode, callback, options);
  });
}

export function BabelTransformer(
  chunk: File,
  encode: BufferEncoding,
  callback: TransformCallback,
  options: TransformOptions,
): void {
  if (chunk.isDirectory()) return callback(null);
  signale.debug(`[babel] Transforming (${chunk.path})`);
  assertInstance(chunk.contents, Buffer);
  transform(
    chunk.contents.toString(encode),
    Object.assign({}, options, { filename: chunk.path }),
    babelTransformCallback,
  );

  function babelTransformCallback(error: unknown, result: BabelFileResult | null): void {
    if (error || typeof result?.code !== 'string') {
      signale.error(`Transform failed: ${chunk.path}`);
      if (error) signale.error(error);
      callback(error);
      return;
    }

    chunk.contents = Buffer.from(result.code);
    callback(null, chunk);
  }
}
