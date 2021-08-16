import { dirname, extname } from 'path';
import type { ExtSatisfiesRange } from '../../utils';
import { loadPackageJSON } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig, ResolvedBundleIOConfig } from '../io';

export interface ECMAScriptModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Supported extnames for babel, copy and tsx task.
   *
   * @default
   * {
   *   babel: ['.js', '.jsx', '.es6', '.es', '.mjs'],
   *   copy: {
   *     exclude: {
   *       include: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
   *       exclude: ['.d.ts'],
   *     },
   *   },
   *   tsc: ['.ts', '.tsx'],
   * };
   */
  exts?: Partial<Record<'babel' | 'copy' | 'tsc', ExtSatisfiesRange>>;
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
  outext?: string;
}

export interface ResolvedECMAScriptModuleConfig
  extends ResolvedBundleIOConfig,
    Omit<ECMAScriptModuleConfig, keyof ResolvedBundleIOConfig> {
  exts: NonNullable<Required<ECMAScriptModuleConfig['exts']>>;
  outext: NonNullable<ECMAScriptModuleConfig['outext']>;
}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedECMAScriptModuleConfig = {
    clean: true,
    entry: [
      'src/**/*',
      '!**/*{demo,e2e,fixture,mock,spec,test}?(s)*/**',
      '!**/*.*(_){demo,e2e,fixture,mock,spec,test}*(_).*',
    ],
    exts: {
      babel: ['.js', '.jsx', '.es6', '.es', '.mjs'],
      copy: {
        exclude: {
          include: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
          exclude: ['.d.ts'],
        },
      },
      tsc: ['.ts', '.tsx'],
    },
    outdir: 'es/',
    outext: '.js',
  };

  if (pkg) {
    if (typeof pkg.module === 'string') {
      config.outdir = dirname(pkg.module);
      config.outext = extname(pkg.module) || '.js';
    } else if (typeof pkg.main === 'string' && pkg.main.endsWith('.mjs')) {
      config.outext = '.mjs';
      config.outdir = dirname(pkg.main);
    }
  }

  return config;
}
