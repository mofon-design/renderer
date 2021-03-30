import type { Transform } from 'stream';
import { obj } from 'through2';
import type { BabelConfig } from '../config';
import { loadBabelConfig } from '../config';
import { createBabelTransformer } from '../transformers';

export function createBabelPipeline(configs: t.Readonly<BabelConfig>[]): Transform;
export function createBabelPipeline(...configs: t.Readonly<BabelConfig>[]): Transform;
export function createBabelPipeline(): Transform {
  const config = loadBabelConfig.apply(null, arguments as never);
  return obj(createBabelTransformer(config));
}
