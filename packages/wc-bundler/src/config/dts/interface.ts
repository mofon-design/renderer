import { dirname } from 'path';
import type { ExtSatisfiesRange } from '../../utils';
import { loadPackageJSON } from '../../utils';
import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig, ResolvedBundleIOConfig } from '../io';

export interface TypeScriptDeclarationConfig extends BundleIOConfig, CoreSharedConfig {
  /**
   * Supported extnames for babel, copy and tsx task.
   *
   * @default
   * {
   *   copy: ['.json'],
   *   tsc: ['.ts', '.tsx'],
   * };
   */
  exts?: Partial<Record<'copy' | 'tsc', ExtSatisfiesRange>>;
  /**
   * Specify entry file(s) or directory(s).
   *
   * @default
   * [
   *   'src\/**\/*.{ts,tsx}',
   *   '!**\/*{demo,e2e,fixture,mock,snapshot,spec,test}?(s)*\/**',
   *   '!**\/*{demo,e2e,fixture,mock,snapshot,spec,test}.*',
   * ]
   */
  entry?: string | string[];
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
  extends ResolvedBundleIOConfig,
    Omit<TypeScriptDeclarationConfig, keyof ResolvedBundleIOConfig> {
  exts: NonNullable<Required<TypeScriptDeclarationConfig['exts']>>;
}

export function DefaultTypeScriptDeclarationConfig(): ResolvedTypeScriptDeclarationConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedTypeScriptDeclarationConfig = {
    clean: true,
    entry: [
      'src/**/*',
      '!**/*{demo,e2e,fixture,mock,snapshot,spec,test}?(s)*/**',
      '!**/*.*(_){demo,e2e,fixture,mock,snapshot,spec,test}*(_).*',
    ],
    exts: {
      copy: ['.json'],
      tsc: ['.ts', '.tsx'],
    },
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
