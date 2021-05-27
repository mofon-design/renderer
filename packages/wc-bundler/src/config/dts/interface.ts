import { dirname } from 'path';
import { loadPackageJSON } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';

export interface TypeScriptDeclarationConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Clean outdir before start io task.
   *
   * @default false
   */
  cleanOutdir?: boolean;
  /**
   * Specify entry file(s) or directory(s).
   *
   * @default
   * ['src\/**\/*.{ts,tsx}', '!**\/*{demo,e2e,fixture,spec,test}?(s)*\/**', '!**\/*{demo,e2e,fixture,spec,test}.*']
   */
  entry?: string | string[];
  /**
   * Specify extname of output file.
   *
   * @default '.d.ts'
   */
  extname?: string;
  /**
   * Specify output directory.
   *
   * @default
   * const { types, typings } = require('package.json');
   * const outdir = typeof types === 'string' && types.endsWith('.d.ts')
   *   ? path.dirname(types)
   *   : typeof typings === 'string' && typings.endsWith('.d.ts')
   *   ? path.dirname(typings)
   *   : 'types/';
   */
  outdir?: string;
}

export interface ResolvedTypeScriptDeclarationConfig
  extends Required<BundleIOConfig>,
    Omit<TypeScriptDeclarationConfig, keyof BundleIOConfig> {}

export function DefaultTypeScriptDeclarationConfig(): ResolvedTypeScriptDeclarationConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedTypeScriptDeclarationConfig = {
    cleanOutdir: false,
    entry: [
      'src/**/*.{ts,tsx}',
      '!**/*{demo,e2e,fixture,spec,test}?(s)*/**',
      '!**/*.*(_){demo,e2e,fixture,spec,test}*(_).*',
    ],
    extname: '.d.ts',
    outdir: 'types/',
  };

  if (pkg) {
    if (typeof pkg.types === 'string' && pkg.types.endsWith('.d.ts')) {
      config.outdir = dirname(pkg.types);
    } else if (typeof pkg.typings === 'string' && pkg.typings.endsWith('.d.ts')) {
      config.outdir = dirname(pkg.typings);
    }
  }

  return config;
}
