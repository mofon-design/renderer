import type { Transform } from 'stream';
import type { TransformCallback, TransformFunction } from 'through2';
import { obj } from 'through2';
import type File from 'vinyl';

export const ExtnamePipelineConfigSymbol = Symbol('BundleIOConfig');

export interface ExtnamePipelineTransform extends Transform {
  readonly [ExtnamePipelineConfigSymbol]: string;
}

export function createExtnamePipeline(extname: string): ExtnamePipelineTransform {
  const tranform = obj(proxyExtnameTransformer as TransformFunction) as ExtnamePipelineTransform;
  (Object.defineProperty as t.Object.defineProperty)(tranform, ExtnamePipelineConfigSymbol, {
    configurable: true,
    value: extname,
  });
  return tranform;
}

function proxyExtnameTransformer(
  this: ExtnamePipelineTransform,
  chunk: File,
  encode: BufferEncoding,
  callback: TransformCallback,
): void {
  ExtnameTransformer(chunk, encode, callback, this[ExtnamePipelineConfigSymbol]);
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
