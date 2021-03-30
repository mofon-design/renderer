import type { BabelConfig } from './babel';

export interface BundleIOConfig {
  /**
   * Specify entry file(s) or directory(s).
   *
   * @default
   * ['src/index.tsx', 'src/index.ts', 'src/index.jsx', 'src/index.js'].find(p => exists(p))
   * glob(require('lerna.json').packages || 'packages/*') // monorepo
   *
   * @description
   * If TypeScript file exists, 'tsconfig.json' should be provided at root directory of project.
   */
  entry?: string | string[];
  /**
   * Exclude pattern(s).
   *
   * @default
   * ['{demo,e2e,fixture,spec,test}?(s)/**', '{demo,e2e,fixture,spec,test}.*']
   */
  excludes?: string | string[];
  /**
   * Specify output directory.
   *
   * @default
   * `${entry.split('.', 1)[0] ?? ''}${extname}` // .js | .esm.js | .umd.js | .umd.min.js
   * `${pkgdir}/{module}` // module: es | lib
   */
  outdir?: string;
  /**
   * Specify output file(path) without extname.
   *
   * @default
   * `${entry.split('.', 1)[0] ?? ''}${extname}` // .js | .esm.js | .umd.js | .umd.min.js
   */
  output?: string;
}

export interface CommonJSModuleConfig extends BabelConfig, BundleIOConfig {}

export interface ECMAScriptModuleConfig extends BabelConfig, BundleIOConfig {}

export interface BundleConfig extends BabelConfig, BundleIOConfig {
  /**
   * Bundle into CommonJS module.
   */
  cjs?: boolean | CommonJSModuleConfig;
  /**
   * Bundle into ECMAScript module.
   */
  esm?: boolean | ECMAScriptModuleConfig;
}
