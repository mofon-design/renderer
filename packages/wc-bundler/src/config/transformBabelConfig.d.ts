import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import type { BabelConfig } from './interface';

export function transformBabelConfig(...configs: BabelConfig[]): BabelTransformOptions;
