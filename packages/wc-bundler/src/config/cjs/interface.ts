import { dirname, resolve } from 'path';
import * as signale from 'signale';
import { env } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface CommonJSModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Specify output directory.
   *
   * @default
   * path.dirname(require('package.json').main) || 'lib/'
   */
  outdir?: string;
}

export interface ResolvedCommonJSModuleConfig
  extends Required<BundleIOConfig>,
    Omit<CommonJSModuleConfig, keyof BundleIOConfig> {}

export function DefaultCommonJSModuleConfig(): ResolvedCommonJSModuleConfig {
  let outdir = 'lib/';

  try {
    const main = require(resolve('package.json'))?.main;
    if (typeof main === 'string') outdir = dirname(main);
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return Object.assign(DefaultBundleIOConfig(), { outdir });
}
