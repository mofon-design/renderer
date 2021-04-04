import { dirname, resolve } from 'path';
import * as signale from 'signale';
import { env } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface ECMAScriptModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Specify output directory.
   *
   * @default
   * path.dirname(require('package.json').module) || 'es/'
   */
  outdir?: string;
}

export interface ResolvedECMAScriptModuleConfig
  extends Required<BundleIOConfig>,
    Omit<ECMAScriptModuleConfig, keyof BundleIOConfig> {}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  let outdir = 'es/';

  try {
    const module = require(resolve('package.json'))?.module;
    if (typeof module === 'string') outdir = dirname(module);
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return Object.assign(DefaultBundleIOConfig(), { outdir });
}
