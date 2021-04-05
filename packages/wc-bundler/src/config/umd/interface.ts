import type { TransformOptions as BabelTransformOptions } from '@babel/core';
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

export function DefaultUMDModuleConfig(): ResolvedUMDModuleConfig {
  return { rollup: {} };
}
