import type { PluginItem as BabelPluginItem } from '@babel/core';
import type { Options as BabelPresetEnv9Config } from '@babel/preset-env';

export interface BabelEnvConfig extends BabelPresetEnv9Config {
  browserslistEnv?: string;
  /**
   * Overrided by `BundleConfig.cjs` and `BundleConfig.esm`.
   */
  modules?: never;
}

export const DefaultBabelEnvConfig: BabelEnvConfig;

export interface BabelMinifyPlugins {
  /**
   * @see [transform-minify-booleans](https://babeljs.io/docs/en/babel-plugin-transform-minify-booleans)
   * @default true
   */
  booleans?: boolean;
  /**
   * @see [minify-builtins](https://babeljs.io/docs/en/babel-plugin-minify-builtins)
   * @default true
   */
  builtIns?: boolean;
  /**
   * @see [transform-inline-consecutive-adds](https://babeljs.io/docs/en/babel-plugin-transform-inline-consecutive-adds)
   * @default true
   */
  consecutiveAdds?: boolean;
  /**
   * @see [minify-dead-code-elimination](https://babeljs.io/docs/en/babel-plugin-minify-dead-code-elimination)
   * @default true
   */
  deadcode?: boolean;
  /**
   * @see [minify-constant-folding](https://babeljs.io/docs/en/babel-plugin-minify-constant-folding)
   * @default true
   */
  evaluate?: boolean;
  /**
   * @see [minify-flip-comparisons](https://babeljs.io/docs/en/babel-plugin-minify-flip-comparisons)
   * @default true
   */
  flipComparisons?: boolean;
  /**
   * @see [minify-guarded-expressions](https://babeljs.io/docs/en/babel-plugin-minify-guarded-expressions)
   * @default true
   */
  guards?: boolean;
  /**
   * @see [minify-infinity](https://babeljs.io/docs/en/babel-plugin-minify-infinity)
   * @default true
   */
  infinity?: boolean;
  /**
   * @see [minify-mangle-names](https://babeljs.io/docs/en/babel-plugin-minify-mangle-names)
   * @default true
   */
  mangle?: boolean;
  /**
   * @see [transform-member-expression-literals](https://babeljs.io/docs/en/babel-plugin-transform-member-expression-literals)
   * @default true
   */
  memberExpressions?: boolean;
  /**
   * @see [transform-merge-sibling-variables](https://babeljs.io/docs/en/babel-plugin-transform-merge-sibling-variables)
   * @default true
   */
  mergeVars?: boolean;
  /**
   * @see [minify-numeric-literals](https://babeljs.io/docs/en/babel-plugin-minify-numeric-literals)
   * @default true
   */
  numericLiterals?: boolean;
  /**
   * @see [transform-property-literals](https://babeljs.io/docs/en/babel-plugin-transform-property-literals)
   * @default true
   */
  propertyLiterals?: boolean;
  /**
   * @see [transform-regexp-constructors](https://babeljs.io/docs/en/babel-plugin-transform-regexp-constructors)
   * @default true
   */
  regexpConstructors?: boolean;
  /**
   * @see [transform-remove-console](https://babeljs.io/docs/en/babel-plugin-transform-remove-console)
   * @default true
   */
  removeConsole?: boolean;
  /**
   * @see [transform-remove-debugger](https://babeljs.io/docs/en/babel-plugin-transform-remove-debugger)
   * @default false
   */
  removeDebugger?: boolean;
  /**
   * @see [transform-remove-undefined](https://babeljs.io/docs/en/babel-plugin-transform-remove-undefined)
   * @default false
   */
  removeUndefined?: boolean;
  /**
   * @see [minify-replace](https://babeljs.io/docs/en/babel-plugin-minify-replace)
   * @default true
   */
  replace?: boolean;
  /**
   * @see [minify-simplify](https://babeljs.io/docs/en/babel-plugin-minify-simplify)
   * @default true
   */
  simplify?: boolean;
  /**
   * @see [transform-simplify-comparison-operators](https://babeljs.io/docs/en/babel-plugin-transform-simplify-comparison-operators)
   * @default true
   */
  simplifyComparisons?: boolean;
  /**
   * @see [minify-type-constructors](https://babeljs.io/docs/en/babel-plugin-minify-type-constructors)
   * @default true
   */
  typeConstructors?: boolean;
  /**
   * @see [transform-undefined-to-void](https://babeljs.io/docs/en/babel-plugin-transform-undefined-to-void)
   * @default true
   */
  undefinedToVoid?: boolean;
}

export interface BabelMinifyConfig extends BabelMinifyPlugins {
  /**
   * Only enable specified plugins.
   */
  only?: (keyof BabelMinifyPlugins)[];
  /**
   * Prevent mangler from altering class names.
   */
  keepClassName?: boolean;
  /**
   * Prevent mangler from altering function names. Useful for code depending on `fn.name`.
   */
  keepFnName?: boolean;
}

export const DefaultBabelMinifyConfig: BabelMinifyConfig;

export interface BabelTypeScriptConfig {
  /**
   * Indicates that every file should be parsed as TS or TSX (depending on the `isTSX` option).
   *
   * @default false
   */
  allExtensions?: boolean;
  /**
   * When enabled, type-only class fields are only removed if they are prefixed with the `declare` modifier.
   *
   * @default true
   */
  allowDeclareFields?: boolean;
  /**
   * Enables compilation of TypeScript namespaces.
   *
   * @default true
   */
  allowNamespaces?: boolean;
  /**
   * Replace the function used when compiling JSX expressions.
   * This is so that we know that the import is not a type import, and should not be removed.
   *
   * @default WC
   */
  jsxPragma?: string;
  /**
   * Replace the function used when compiling JSX fragment expressions.
   * This is so that we know that the import is not a type import, and should not be removed.
   *
   * @default WC.Fragment
   */
  jsxPragmaFrag?: string;
  /**
   * Forcibly enables jsx parsing. Otherwise angle brackets will be treated as typescript's
   * legacy type assertion `var foo = <string>bar;`. Also, `isTSX: true` requires `allExtensions: true`.
   *
   * @default false
   */
  isTSX?: boolean;
  /**
   * When set to true, the transform will only remove type-only imports (introduced in TypeScript 3.8).
   * This should only be used if you are using TypeScript >= 3.8.
   *
   * @default false
   */
  onlyRemoveTypeImports?: boolean;
}

export const DefaultBabelTypeScriptConfig: BabelTypeScriptConfig;

export interface BabelConfig {
  /**
   * Babel preset env config.
   *
   * @see [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
   */
  env?: BabelEnvConfig;
  /**
   * Babel preset minify config.
   */
  minify?: boolean | BabelMinifyConfig;
  /**
   * Extra babel plugins.
   */
  plugins?: BabelPluginItem[];
  /**
   * Extra babel presets.
   */
  presets?: BabelPluginItem[];
  /**
   * Enable transform TypeScript.
   *
   * @default fs.statSync('tsconfig.json').isFile()
   */
  typescript?: boolean | BabelTypeScriptConfig;
}

export const DefaultBabelConfig: BabelConfig;

export interface BundleIOConfig {
  /**
   * Specify entry file(s).
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
