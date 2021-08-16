import { dirname, extname } from 'path';
import type { ExtSatisfiesRange } from '../../utils';
import { loadPackageJSON } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig, ResolvedBundleIOConfig } from '../io';

export interface CommonJSModuleConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Supported extnames for babel, copy and tsx task.
   *
   * @default
   * {
   *   babel: ['.js', '.jsx', '.es6', '.es', '.mjs'],
   *   get copy() {
   *     return { exclude: [this.babel, this.tsc] };
   *   },
   *   tsc: ['.ts', '.tsx'],
   * };
   */
  exts?: Partial<Record<'babel' | 'copy' | 'tsc', ExtSatisfiesRange>>;
  /**
   * Specify output directory.
   *
   * @default
   * const { main } = require('package.json');
   * const outdir = typeof main === 'string' ? path.dirname(main) : 'lib/';
   */
  outdir?: string;
  /**
   * Specify extname of output file.
   *
   * @default
   * const { main } = require('package.json');
   * const extname = typeof main === 'string' ? (path.extname(main) || '.js') : '.js';
   */
  outext?: string;
}

export interface ResolvedCommonJSModuleConfig
  extends ResolvedBundleIOConfig,
    Omit<CommonJSModuleConfig, keyof ResolvedBundleIOConfig> {
  exts: NonNullable<Required<CommonJSModuleConfig['exts']>>;
  outext: NonNullable<CommonJSModuleConfig['outext']>;
}

export function DefaultCommonJSModuleConfig(): ResolvedCommonJSModuleConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedCommonJSModuleConfig = {
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
    outdir: 'lib/',
    outext: '.js',
  };

  if (pkg && typeof pkg.main === 'string') {
    config.outdir = dirname(pkg.main);
    config.outext = extname(pkg.main) || '.js';
  }

  return config;
}
