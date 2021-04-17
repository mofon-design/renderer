import { dirname, extname, resolve } from 'path';
import signale from 'signale';
import { env } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface CommonJSModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Specify extname of output file.
   *
   * @default
   * const { main } = require('package.json');
   * const extname = typeof main === 'string' ? (path.extname(main) || '.js') : '.js';
   */
  extname?: string;
  /**
   * Specify output directory.
   *
   * @default
   * const { main } = require('package.json');
   * const outdir = typeof main === 'string' ? path.dirname(main) : 'lib/';
   */
  outdir?: string;
}

export interface ResolvedCommonJSModuleConfig
  extends Required<BundleIOConfig>,
    Omit<CommonJSModuleConfig, keyof BundleIOConfig> {}

export function DefaultCommonJSModuleConfig(): ResolvedCommonJSModuleConfig {
  const config: ResolvedCommonJSModuleConfig = DefaultBundleIOConfig();

  config.outdir = 'lib/';

  try {
    const pkg: t.UnknownRecord | null = require(resolve('package.json'));

    if (typeof pkg === 'object' && pkg) {
      if (typeof pkg.main === 'string') {
        config.outdir = dirname(pkg.main);
        config.extname = extname(pkg.main) || '.js';
      }
    }
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return config;
}
