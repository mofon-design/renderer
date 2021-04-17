import { dirname, extname, resolve } from 'path';
import signale from 'signale';
import { env } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface ECMAScriptModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Specify extname of output file.
   *
   * @default
   * const { main, module } = require('package.json');
   * const extname = typeof module === 'string'
   *   ? (path.extname(module) || '.js')
   *   : typeof main === 'string' && main.endsWith('.mjs')
   *   ? '.mjs'
   *   : '.js';
   */
  extname?: string;
  /**
   * Specify output directory.
   *
   * @default
   * const { main, module } = require('package.json');
   * const outdir = typeof module === 'string'
   *   ? path.dirname(module)
   *   : typeof main === 'string' && main.endsWith('.mjs')
   *   ? path.dirname(main)
   *   : 'es/';
   */
  outdir?: string;
}

export interface ResolvedECMAScriptModuleConfig
  extends Required<BundleIOConfig>,
    Omit<ECMAScriptModuleConfig, keyof BundleIOConfig> {}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  const config: ResolvedECMAScriptModuleConfig = DefaultBundleIOConfig();

  config.outdir = 'es/';

  try {
    const pkg: t.UnknownRecord | null = require(resolve('package.json'));

    if (typeof pkg === 'object' && pkg) {
      if (typeof pkg.module === 'string') {
        config.outdir = dirname(pkg.module);
        config.extname = extname(pkg.module) || '.js';
      } else if (typeof pkg.main === 'string' && pkg.main.endsWith('.mjs')) {
        config.extname = '.mjs';
        config.outdir = dirname(pkg.main);
      }
    }
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return config;
}
