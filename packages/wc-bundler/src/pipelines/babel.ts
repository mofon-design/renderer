import type { BabelFileResult, TransformOptions } from '@babel/core';
import { transform } from '@babel/core';
import * as signale from 'signale';
import type { Transform } from 'stream';
import type { TransformCallback, TransformFunction } from 'through2';
import { obj } from 'through2';
import type * as File from 'vinyl';
import type { BabelConfig } from '../config';
import { loadBabelConfig } from '../config';
import { assertInstance, defineLazyLoadProperty, env } from '../utils';

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
    return loadBabelConfig.apply(null, args);
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
  assertInstance(chunk.contents, Buffer);
  if (env.DEBUG) signale.debug(`[babel] Transforming (${chunk.path})`);
  transform(
    chunk.contents.toString(encode),
    Object.assign({}, options, { filename: chunk.path }),
    babelTransformCallback,
  );

  function babelTransformCallback(error: unknown, result: BabelFileResult | null): void {
    if (error || !result?.code) {
      signale.error(`Transform failed: ${chunk.path}`);
      if (error) console.error(error);
      callback(error);
      return;
    }

    chunk.contents = Buffer.from(result.code);
    callback(null, chunk);
  }
}
