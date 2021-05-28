import { dirname, extname } from 'path';
import { loadPackageJSON } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig, ResolvedBundleIOConfig } from '../io';

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
  extends ResolvedBundleIOConfig,
    Omit<ECMAScriptModuleConfig, keyof ResolvedBundleIOConfig> {
  extname: string;
}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedECMAScriptModuleConfig = {
    clean: true,
    entry: [
      'src/**/*',
      '!**/*{demo,e2e,fixture,spec,test}?(s)*/**',
      '!**/*.*(_){demo,e2e,fixture,spec,test}*(_).*',
    ],
    extname: '.js',
    outdir: 'es/',
  };

  if (pkg) {
    if (typeof pkg.module === 'string') {
      config.outdir = dirname(pkg.module);
      config.extname = extname(pkg.module) || '.js';
    } else if (typeof pkg.main === 'string' && pkg.main.endsWith('.mjs')) {
      config.extname = '.mjs';
      config.outdir = dirname(pkg.main);
    }
  }

  return config;
}
