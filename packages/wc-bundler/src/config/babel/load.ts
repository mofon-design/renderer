import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import { loadPartialConfig } from '@babel/core';
import type { BabelConfig } from './interface';
import { transformBabelConfig } from './transform';

export function loadBabelConfig(configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(): BabelTransformOptions {
  return loadPartialConfig(transformBabelConfig.apply(null, arguments as never))?.options ?? {};
}
