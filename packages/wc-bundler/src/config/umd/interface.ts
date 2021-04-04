import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import { resolve } from 'path';
import * as signale from 'signale';
import { detectFile, env } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { RollupBabelConfig, RollupConfig } from '../rollup';

export interface UMDModuleRollupBabelAdditionalConfig
  extends Omit<RollupBabelConfig, Exclude<keyof BabelTransformOptions, 'exclude' | 'include'>> {
  /**
   * An array of file extensions that Babel should transpile.
   *
   * @default
   * ['.js', '.jsx', '.es6', '.es', '.mjs'].concat(
   *   UMDModuleConfig.babel.typescript ? ['.ts', '.tsx'] : [],
   * )
   */
  extensions?: string[];
}

export interface UMDModuleConfig extends Omit<RollupConfig, 'babel'>, CoreSharedConfig {
  /**
   * Additional config for Rollup Babel plugin.
   * Set `false` to disable Babel plugin.
   *
   * @default true
   */
  rollupBabel?: UMDModuleRollupBabelAdditionalConfig | boolean;
}

export interface ResolvedUMDModuleConfig extends Omit<CoreSharedConfig, 'babel'> {
  rollup: RollupConfig;
}

const DefaultEntries = [
  'src/index.tsx',
  'src/index.ts',
  'src/index.jsx',
  'src/index.js',
  'src/index.mjs',
];

export function DefaultUMDModuleConfig(): ResolvedUMDModuleConfig {
  let file = 'index.umd.js';

  try {
    const main = require(resolve('package.json'))?.main;
    if (typeof main === 'string' && main) file = main;
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return {
    rollup: {
      input: DefaultEntries.find((entry) => detectFile(entry)),
      output: { file, format: 'umd' },
    },
  };
}
