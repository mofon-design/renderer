import type { RollupBabelInputPluginOptions as RollupBabelConfig } from '@rollup/plugin-babel';
import { babel } from '@rollup/plugin-babel';
import cjs from '@rollup/plugin-commonjs';
import type { RollupJsonOptions as RollupJsonConfig } from '@rollup/plugin-json';
import json from '@rollup/plugin-json';
import type { RollupNodeResolveOptions as RollupNodeResolveConfig } from '@rollup/plugin-node-resolve';
import nodeResolve from '@rollup/plugin-node-resolve';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import url from '@rollup/plugin-url';
import { basename } from 'path';
import type {
  RollupOptions,
  InputOption as RollupInputOptions,
  OutputOptions as RollupOutputOptions,
  Plugin as RollupPlugin,
} from 'rollup';
import type { Options as RollupTerserConfig } from 'rollup-plugin-terser';
import { terser } from 'rollup-plugin-terser';
import { env, loadPackageJSON, pascalCase, resolveModuleByBabel } from '../../utils';

export type RollupCommonJSConfig = typeof cjs extends (options?: infer Options) => unknown
  ? Options
  : never;

export function DefaultRollupCommonJSConfig(): RollupCommonJSConfig {
  return {};
}

export type { RollupBabelConfig, RollupJsonConfig, RollupNodeResolveConfig, RollupTerserConfig };

export function DefaultRollupBabelConfig(): RollupBabelConfig {
  return {};
}

export function DefaultRollupJsonConfig(): RollupJsonConfig {
  return {};
}

export function DefaultRollupNodeResolveConfig(): RollupNodeResolveConfig {
  return {};
}

export function DefaultRollupTerserConfig(): RollupTerserConfig {
  return {};
}

export interface RollupUrlConfig {
  /**
   * A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns,
   * which specifies the files in the build the plugin should *ignore*.
   * By default no files are ignored.
   */
  exclude?: string | string[];
  /**
   * A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns,
   * which specifies the files in the build the plugin should operate on.
   * By default .svg, .png, .jpg, .jpeg, .gif and .webp files are targeted.
   *
   * @default
   * ['**\/*.svg', '**\/*.png', '**\/*.jp(e)?g', '**\/*.gif', '**\/*.webp']
   */
  include?: string | string[];
  /**
   * The file size limit for inline files. If a file exceeds this limit, it will be copied to
   * the destination folder and the hashed filename will be provided instead.
   * If `limit` is set to `0` all files will be copied.
   *
   * @default 14336
   */
  limit?: number;
  /**
   * A string which will be added in front of filenames when they are not inlined but are copied.
   *
   * @default ''
   */
  publicPath?: string;
  /**
   * If `false`, will prevent files being emitted by this plugin.
   * This is useful for when you are using Rollup to emit both a client-side and server-side bundle.
   *
   * @default true
   */
  emitFiles?: boolean;
  /**
   * If emitFiles is true, this option can be used to rename the emitted files.
   * It accepts the following string replacements:
   * - `[hash]` - The hash value of the file's contents
   * - `[name]` - The name of the imported file (without its file extension)
   * - `[extname]` - The extension of the imported file (including the leading .)
   * - `[dirname]` - The parent directory name of the imported file (including trailing /)
   *
   * @default '[hash][extname]'
   */
  fileName?: string;
  /**
   * When using the [dirname] replacement in fileName, use this directory as the source directory
   * from which to create the file path rather than the parent directory of the imported file.
   *
   * @default ''
   *
   * @example
   * // src/path/to/file.js
   * import png from './image.png';
   *
   * // config
   * const config = {
   *   fileName: '[dirname][hash][extname]',
   *   sourceDir: path.join(__dirname, 'src')
   * };
   *
   * // Emitted File:
   * 'path/to/image.png'
   */
  sourceDir?: string;
  /**
   * The destination dir to copy assets, usually used to rebase the assets according to HTML files.
   *
   * @default ''
   */
  destDir?: string;
}

export function DefaultRollupUrlConfig(): RollupUrlConfig {
  return {};
}

export interface BuiltinRollupPluginsConfig {
  /**
   * Enable Rollup Babel plugin.
   *
   * @default true
   */
  babel?: RollupBabelConfig | boolean;
  /**
   * Enable Rollup CommonJS plugin.
   *
   * @default true
   */
  cjs?: RollupCommonJSConfig | boolean;
  /**
   * Enable Rollup JSON plugin.
   *
   * @default true
   */
  json?: RollupJsonConfig | boolean;
  /**
   * Enable Rollup node resolve plugin.
   *
   * @default true
   */
  nodeResolve?: RollupNodeResolveConfig | boolean;
  /**
   * Enable Rollup Terser plugin.
   *
   * @default !env.DEBUG
   */
  terser?: RollupTerserConfig | boolean;
  /**
   * Enable Rollup URL plugin.
   *
   * @default true
   */
  url?: RollupUrlConfig | boolean;
}

export type ResolvedBuiltinRollupPluginsConfig = {
  [Key in keyof BuiltinRollupPluginsConfig]: Exclude<BuiltinRollupPluginsConfig[Key], boolean>;
};

export function DefaultBuiltinRollupPluginsConfig(): ResolvedBuiltinRollupPluginsConfig {
  return {
    babel: DefaultRollupBabelConfig(),
    cjs: DefaultRollupCommonJSConfig(),
    json: DefaultRollupJsonConfig(),
    nodeResolve: DefaultRollupNodeResolveConfig(),
    terser: env.DEBUG ? undefined : DefaultRollupTerserConfig(),
    url: DefaultRollupUrlConfig(),
  };
}

export const BuiltinRollupPluginsMap: {
  readonly [Key in keyof ResolvedBuiltinRollupPluginsConfig]-?: (
    options: ResolvedBuiltinRollupPluginsConfig[Key],
  ) => RollupPlugin;
} = { babel, cjs, json, nodeResolve, terser, url };

export interface RollupConfig extends RollupOptions, BuiltinRollupPluginsConfig {
  input?: RollupInputOptions;
  output?: RollupOutputOptions;
}

export interface ResolvedRollupConfig extends Omit<RollupOptions, 'input' | 'output'> {
  /**
   * Specify entry file.
   *
   * If esm task enabled, the entry of esm output will be used as the input of rollup.
   *
   * @default
   * 'src/index.{tsx,ts,jsx,js,mjs}'
   */
  input: RollupInputOptions;
  /**
   * Specify output options.
   *
   * @default
   * let file = 'index.umd.js', name;
   * const pkg = require('package.json');
   * const asUMDName = (name) => /[^a-z_]/i.test(name) ? PascalCase(name) : name.toUpperCase();
   *
   * if (pkg?.main) {
   *   const base = basename(pkg.main).split('.').find((f) => f.length > 0);
   *   name = base ? asUMDName(base) : undefined;
   * }
   *
   * if (name === undefined && pkg?.name) {
   *   const base = pkg.name.split('/').reverse()[0];
   *   name = base ? asUMDName(base) : undefined;
   * }
   *
   * if (name === undefined) {
   *   name = asUMDName(basename(process.cwd()));
   * }
   *
   * const output = { file: main || 'index.umd.js', format: 'umd', name };
   */
  output: RollupOutputOptions;
}

export function DefaultRollupConfig(): ResolvedRollupConfig {
  let file = 'index.umd.js';
  let name: string | undefined;
  const pkg = loadPackageJSON();

  if (pkg) {
    if (typeof pkg.main === 'string' && pkg.main) {
      const base = basename(pkg.main)
        .split('.')
        .find((fragment) => fragment.length > 0);

      file = pkg.main;
      name = base ? asUMDName(base) : undefined;
    }

    if (name === undefined && typeof pkg.name === 'string' && pkg.name) {
      const base: string | undefined = pkg.name.split('/').reverse()[0];
      name = base ? asUMDName(base) : undefined;
    }
  }

  if (name === undefined) {
    name = asUMDName(basename(process.cwd()));
  }

  return {
    input: resolveModuleByBabel('src/index') || 'src/index',
    output: { file, format: 'umd', name },
  };
}

function asUMDName(name: string): string {
  return /[^a-z_]/i.test(name) ? pascalCase(name) : name.toUpperCase();
}
