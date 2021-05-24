import type {
  PluginItem as BabelPluginItem,
  TransformOptions as BabelTransformOptions,
} from '@babel/core';
import type { Options as BabelPluginTransformRuntimeConfig } from '@babel/plugin-transform-runtime';
import type {
  ModuleOption as BabelPresetEnvModuleOption,
  Options as BabelPresetEnv9Config,
  Target as BabelTarget,
  TargetsOptions as BabelTargetsOptions,
} from '@babel/preset-env';
import { join } from 'path';
import { detectFile, isRoot, resolveModuleByBabel, root } from '../../utils';

export interface BabelPluginProposalDecoratorsConfig {
  /**
   * This option was added to help tc39 collect feedback from the community by
   * allowing experimentation with both possible syntaxes.
   *
   * For more information, check out: tc39/proposal-decorators#69.
   */
  decoratorsBeforeExport?: boolean;
  /**
   * Use the legacy (stage 1) decorators syntax and behavior.
   */
  legacy?: boolean;
}

export function DefaultBabelPluginProposalDecoratorsConfig(): BabelPluginProposalDecoratorsConfig {
  return {};
}

export function DefaultBabelPluginTransformRuntimeConfig(): BabelPluginTransformRuntimeConfig {
  return {}; // TODO
}

export interface BabelEnvConfig extends BabelPresetEnv9Config {
  browserslistEnv?: string;
  /**
   * Overrided by `BundleConfig.cjs` and `BundleConfig.esm`.
   */
  modules?: BabelPresetEnvModuleOption;
  targets?: BabelTargetsOptions | { [key in Lowercase<BabelTarget>]: string };
}

export function DefaultBabelEnvConfig(): BabelEnvConfig {
  return {
    browserslistEnv: undefined,
    bugfixes: true,
    configPath: root,
    ignoreBrowserslistConfig: true,
    loose: false,
    shippedProposals: false,
    spec: false,
    targets: {
      edge: '79',
      firefox: '63',
      chrome: '54',
      safari: '10.1',
    },
    useBuiltIns: false,
  };
}

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

export function DefaultBabelMinifyPluginsConfig(): Required<BabelMinifyPlugins> {
  return {
    booleans: true,
    builtIns: true,
    consecutiveAdds: true,
    deadcode: true,
    evaluate: true,
    flipComparisons: true,
    guards: true,
    infinity: true,
    mangle: true,
    memberExpressions: true,
    mergeVars: true,
    numericLiterals: true,
    propertyLiterals: true,
    regexpConstructors: true,
    removeConsole: false,
    removeDebugger: false,
    removeUndefined: true,
    replace: true,
    simplify: true,
    simplifyComparisons: true,
    typeConstructors: true,
    undefinedToVoid: true,
  };
}

DefaultBabelMinifyPluginsConfig.readonly = DefaultBabelMinifyPluginsConfig() as t.Readonly<
  Required<BabelMinifyPlugins>
>;

export function DefaultBabelMinifyConfig(): BabelMinifyConfig {
  return DefaultBabelMinifyPluginsConfig();
}

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

export function DefaultBabelTypeScriptConfig(): BabelTypeScriptConfig {
  return {
    allExtensions: false,
    allowDeclareFields: true,
    allowNamespaces: true,
    jsxPragma: 'WC',
    jsxPragmaFrag: 'WC.Fragment',
    isTSX: false,
    onlyRemoveTypeImports: false,
  };
}

export function DefaultBabelPluginsConfig(): BabelPluginItem[] {
  return [];
}

export interface BuiltinBabelPluginsConfig {
  ['plugin-proposal-async-do-expressions']?: boolean;
  ['plugin-proposal-class-static-block']?: boolean;
  ['plugin-proposal-decorators']?: BabelPluginProposalDecoratorsConfig | true;
  ['plugin-proposal-do-expressions']?: boolean;
  ['plugin-proposal-export-default-from']?: boolean;
  ['plugin-proposal-function-bind']?: boolean;
  ['plugin-proposal-function-sent']?: boolean;
  ['plugin-proposal-partial-application']?: boolean;
  ['plugin-proposal-pipeline-operator']?: boolean;
  ['plugin-proposal-private-property-in-object']?: boolean;
  ['plugin-proposal-throw-expressions']?: boolean;
  ['plugin-syntax-dynamic-import']?: boolean;
  ['plugin-transform-runtime']?: BabelPluginTransformRuntimeConfig | boolean;
}

export const DefaultBuiltinBabelPluginsConfigGetterMap: Required<BuiltinBabelPluginsConfig> = {
  get ['plugin-proposal-async-do-expressions']() {
    return true;
  },
  get ['plugin-proposal-class-static-block']() {
    return true;
  },
  get ['plugin-proposal-decorators']() {
    return DefaultBabelPluginProposalDecoratorsConfig();
  },
  get ['plugin-proposal-do-expressions']() {
    return true;
  },
  get ['plugin-proposal-export-default-from']() {
    return true;
  },
  get ['plugin-proposal-function-bind']() {
    return true;
  },
  get ['plugin-proposal-function-sent']() {
    return true;
  },
  get ['plugin-proposal-partial-application']() {
    return true;
  },
  get ['plugin-proposal-pipeline-operator']() {
    return true;
  },
  get ['plugin-proposal-private-property-in-object']() {
    return true;
  },
  get ['plugin-proposal-throw-expressions']() {
    return true;
  },
  get ['plugin-syntax-dynamic-import']() {
    return true;
  },
  get ['plugin-transform-runtime']() {
    return DefaultBabelPluginTransformRuntimeConfig();
  },
};

export function DefaultBuiltinBabelPluginsConfig(): BuiltinBabelPluginsConfig {
  const DefaultEnabledPlugins: (keyof BuiltinBabelPluginsConfig)[] = [
    'plugin-proposal-async-do-expressions',
    'plugin-proposal-class-static-block',
    'plugin-proposal-decorators',
    'plugin-proposal-do-expressions',
    'plugin-proposal-export-default-from',
    'plugin-proposal-private-property-in-object',
    'plugin-proposal-throw-expressions',
    'plugin-syntax-dynamic-import',
    'plugin-transform-runtime',
  ];

  return DefaultEnabledPlugins.reduce<BuiltinBabelPluginsConfig>((map, key) => {
    map[key] = DefaultBuiltinBabelPluginsConfigGetterMap[key] as never;
    return map;
  }, {});
}

export const BuiltinBabelPluginsNameMap: Readonly<
  Record<keyof BuiltinBabelPluginsConfig, BabelPluginItem>
> = {
  ['plugin-proposal-async-do-expressions']: '@babel/plugin-proposal-async-do-expressions',
  ['plugin-proposal-class-static-block']: '@babel/plugin-proposal-class-static-block',
  ['plugin-proposal-decorators']: '@babel/plugin-proposal-decorators',
  ['plugin-proposal-do-expressions']: '@babel/plugin-proposal-do-expressions',
  ['plugin-proposal-export-default-from']: '@babel/plugin-proposal-export-default-from',
  ['plugin-proposal-function-bind']: '@babel/plugin-proposal-function-bind',
  ['plugin-proposal-function-sent']: '@babel/plugin-proposal-function-sent',
  ['plugin-proposal-partial-application']: '@babel/plugin-proposal-partial-application',
  ['plugin-proposal-pipeline-operator']: '@babel/plugin-proposal-pipeline-operator',
  ['plugin-proposal-private-property-in-object']:
    '@babel/plugin-proposal-private-property-in-object',
  ['plugin-proposal-throw-expressions']: '@babel/plugin-proposal-throw-expressions',
  ['plugin-syntax-dynamic-import']: '@babel/plugin-syntax-dynamic-import',
  ['plugin-transform-runtime']: '@babel/plugin-transform-runtime',
};

export function DefaultBabelPresetsConfig(): BabelPluginItem[] {
  return [];
}

export interface BuiltinBabelPresetsConfig {
  /**
   * Babel preset env config.
   *
   * @see [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
   */
  env?: boolean | BabelEnvConfig;
  /**
   * Babel preset minify config.
   */
  minify?: boolean | BabelMinifyConfig;
  /**
   * Enable transform TypeScript.
   *
   * @default fs.statSync('tsconfig.json').isFile()
   */
  typescript?: boolean | BabelTypeScriptConfig;
}

export type ResolvedBuiltinBabelPresetsConfig = {
  [Key in keyof BuiltinBabelPresetsConfig]: Exclude<BuiltinBabelPresetsConfig[Key], boolean>;
};

export const DefaultBuiltinBabelPresetsConfigGetterMap: Required<ResolvedBuiltinBabelPresetsConfig> = {
  get env() {
    return DefaultBabelEnvConfig();
  },
  get minify() {
    return DefaultBabelMinifyConfig();
  },
  get typescript() {
    return DefaultBabelTypeScriptConfig();
  },
};

export function DefaultBuiltinBabelPresetsConfig(): ResolvedBuiltinBabelPresetsConfig {
  return {
    env: DefaultBuiltinBabelPresetsConfigGetterMap.env,
    typescript: detectFile('tsconfig.json')
      ? DefaultBuiltinBabelPresetsConfigGetterMap.typescript
      : undefined,
  };
}

export const BuiltinBabelPresetsNameMap: Readonly<
  Record<keyof BuiltinBabelPresetsConfig, BabelPluginItem>
> = {
  env: '@babel/preset-env',
  minify: 'babel-preset-minify',
  typescript: '@babel/preset-typescript',
};

export interface BabelConfig
  extends Omit<BabelTransformOptions, 'env'>,
    BuiltinBabelPluginsConfig,
    BuiltinBabelPresetsConfig {
  /**
   * Specify whether or not to use .babelrc and .babelignore files.
   *
   * @default false
   */
  babelrc?: boolean | null;
  /**
   * The config file to load Babel's config from.
   * `false` will disable searching for config files.
   *
   * @default
   * require.resolve('./babel.config') ??
   * require.resolve('./.babelrc') ??
   * require.resolve(path.join(root, './babel.config')) ??
   * require.resolve(path.join(root, './.babelrc'))
   */
  configFile?: string | boolean | null;
}

export function DefaultBabelConfig(): BabelConfig {
  const extra: BabelConfig = {
    babelrc: false,
    configFile:
      resolveModuleByBabel('./babel.config') ??
      resolveModuleByBabel('./.babelrc') ??
      (isRoot()
        ? undefined
        : resolveModuleByBabel(join(root, './babel.config')) ??
          resolveModuleByBabel(join(root, './.babelrc'))),
    plugins: DefaultBabelPluginsConfig(),
    presets: DefaultBabelPresetsConfig(),
  };

  return Object.assign(
    extra,
    DefaultBuiltinBabelPluginsConfig(),
    DefaultBuiltinBabelPresetsConfig(),
  );
}
