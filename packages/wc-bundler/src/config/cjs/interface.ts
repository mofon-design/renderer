import { dirname, extname } from 'path';
import { loadPackageJSON } from '../../utils';
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
  const pkg = loadPackageJSON();
  const config: ResolvedCommonJSModuleConfig = DefaultBundleIOConfig();

  config.outdir = 'lib/';

  if (pkg && typeof pkg.main === 'string') {
    config.outdir = dirname(pkg.main);
    config.extname = extname(pkg.main) || '.js';
  }

  return config;
}
