import type { Transform } from 'stream';
import type { TransformCallback } from 'through2';
import { obj } from 'through2';
import type File from 'vinyl';

export function createCopyPipeline(): Transform {
  return obj(function copy(chunk: File, _: BufferEncoding, callback: TransformCallback): void {
    callback(null, chunk);
  });
}
