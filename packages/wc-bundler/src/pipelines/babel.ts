import type { BabelFileResult, TransformOptions } from '@babel/core';
import { transform } from '@babel/core';
import type { Transform } from 'stream';
import type { TransformCallback, TransformFunction } from 'through2';
import { obj } from 'through2';
import type File from 'vinyl';
import type { BabelConfig } from '../config';
import { loadBabelConfig } from '../config';
import { assertInstance, defineLazyLoadProperty, signale } from '../utils';

export const BabelPipelineTransformOptionsSymbol = Symbol('BabelTransformOptions');

export interface BabelPipelineTransform extends Transform {
  readonly [BabelPipelineTransformOptionsSymbol]: TransformOptions;
}

export function createBabelPipeline(configs: t.Readonly<BabelConfig>[]): BabelPipelineTransform;
export function createBabelPipeline(...configs: t.Readonly<BabelConfig>[]): BabelPipelineTransform;
export function createBabelPipeline(): BabelPipelineTransform {
  const args = Array.from(arguments);
  const tranform = obj(proxyBabelTransformer as TransformFunction) as BabelPipelineTransform;
  defineLazyLoadProperty(tranform, BabelPipelineTransformOptionsSymbol, () => {
    const resolved = loadBabelConfig.apply(null, args);
    return resolved;
  });
  return tranform;
}

function proxyBabelTransformer(
  this: BabelPipelineTransform,
  chunk: File,
  encode: BufferEncoding,
  callback: TransformCallback,
): void {
  BabelTransformer(chunk, encode, callback, this[BabelPipelineTransformOptionsSymbol]);
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
