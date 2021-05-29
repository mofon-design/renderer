import type { Options } from 'prettier';
import { format } from 'prettier';
import type { Transform } from 'stream';
import type { TransformCallback } from 'through2';
import { obj } from 'through2';
import type File from 'vinyl';
import { assertInstance, signale } from '../utils';

export function createPrettierPipeline(options?: Options): Transform {
  return obj(function proxyPrettierTransformer(
    chunk: File,
    encode: BufferEncoding,
    callback: TransformCallback,
  ): void {
    PrettierTransformer(chunk, encode, callback, options);
  });
}

export function PrettierTransformer(
  chunk: File,
  encode: BufferEncoding,
  callback: TransformCallback,
  options?: Options,
): void {
  if (chunk.isDirectory()) return callback(null);
  signale.debug(`[prettier] Formatting (${chunk.history[0] || chunk.path})`);
  assertInstance(chunk.contents, Buffer);

  try {
    callback(null, format(chunk.contents.toString(encode), options));
  } catch (error) {
    callback(error);
  }
}
