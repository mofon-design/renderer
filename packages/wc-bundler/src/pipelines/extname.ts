import type { Transform } from 'stream';
import type { TransformCallback } from 'through2';
import type { ExtSatisfiesRange } from '../utils';
import { extSatisfies } from '../utils';
import { obj } from 'through2';
import type File from 'vinyl';

export function createExtnamePipeline(extname: string): Transform {
  return obj(function proxyExtnameTransformer(
    chunk: File,
    encode: BufferEncoding,
    callback: TransformCallback,
  ): void {
    ExtnameTransformer(chunk, encode, callback, extname);
  });
}

export function ExtnameTransformer(
  chunk: File,
  _encode: BufferEncoding,
  callback: TransformCallback,
  extname: string,
): void {
  chunk.extname = extname;
  callback(null, chunk);
}

export function filterByExtname(range: ExtSatisfiesRange): Transform {
  return obj(function SplitByExtname(
    chunk: File,
    _encode: BufferEncoding,
    callback: TransformCallback,
  ) {
    if (!chunk.isDirectory() && extSatisfies(chunk.basename, range)) callback(null, chunk);
    else callback(null);
  });
}
