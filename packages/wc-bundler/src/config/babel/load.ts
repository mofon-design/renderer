import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import { loadOptions } from '@babel/core';
import type { BabelConfig } from './interface';
import { transformBabelConfig } from './transform';

export function loadBabelConfig(configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(): BabelTransformOptions {
  return loadOptions(transformBabelConfig.apply(null, arguments as never)) as BabelTransformOptions;
}
