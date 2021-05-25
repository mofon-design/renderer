import { loadPackageJSON } from '../../utils';
import type { BabelConfig } from '../babel';
import type { CommonJSModuleConfig } from '../cjs';
import type { ECMAScriptModuleConfig } from '../esm';
import type { UMDModuleConfig } from '../umd';
import type { WorkspaceConfig } from '../workspace';
import { DefaultWorkspaceConfig } from '../workspace';

export interface CoreGroupedConfig {
  /**
   * Config workspace.
   */
  workspace?: boolean | WorkspaceConfig;
}

export type ResolvedCoreGroupedConfig = {
  [Key in keyof CoreGroupedConfig]: Exclude<CoreGroupedConfig[Key], boolean>;
};

export const DefaultCoreGroupedConfigGetterMap: Required<ResolvedCoreGroupedConfig> = {
  get workspace() {
    return DefaultWorkspaceConfig();
  },
};

export type CoreSharedConfigItem<Config> = Config | Config[];

export interface CoreSharedConfig {
  /**
   * Config babel transformer.
   */
  babel?: CoreSharedConfigItem<BabelConfig>;
}

export type WithResolvedCoreSharedConfig<T extends CoreSharedConfig> = Omit<
  T,
  keyof CoreSharedConfig
> &
  ResolvedCoreSharedConfig;

export type ResolvedCoreSharedConfig = {
  [Key in keyof CoreSharedConfig]-?: CoreSharedConfig[Key] extends CoreSharedConfigItem<infer Item>
    ? NonNullable<t.Readonly<Item>>[]
    : never;
};

export const DefaultCoreSharedConfigGetterMap: ResolvedCoreSharedConfig = {
  get babel() {
    return [];
  },
};

export interface CoreTaskConfig {
  /**
   * Enable CommonJS module output.
   *
   * @default
   * const { main, type } = require('package.json');
   * const cjs = typeof type === 'string' ? type === 'commonjs' : !/(\.umd\.js|\.mjs)$/.test(main);
   */
  cjs?: boolean | CommonJSModuleConfig;
  /**
   * Enable ECMAScript module output.
   *
   * @default
   * const { main, module, type } = require('package.json');
   * const esm = type === 'module' || typeof module === 'string' || main.endsWith('.mjs');
   */
  esm?: boolean | ECMAScriptModuleConfig;
  /**
   * Enable UMD module output.
   *
   * @default
   * require('package.json').main.endsWith('.umd.js')
   */
  umd?: boolean | UMDModuleConfig;
}

export type ResolvedCoreTaskConfig = {
  [Key in keyof CoreTaskConfig]: Exclude<CoreTaskConfig[Key], boolean>;
};

export const DefaultCoreTaskConfigGetterMap: Required<ResolvedCoreTaskConfig> = {
  get cjs() {
    return {};
  },
  get esm() {
    return {};
  },
  get umd() {
    return {};
  },
};

export interface CoreConfig extends CoreGroupedConfig, CoreSharedConfig, CoreTaskConfig {}

export interface ResolvedCoreConfig
  extends ResolvedCoreGroupedConfig,
    ResolvedCoreSharedConfig,
    ResolvedCoreTaskConfig {}

export function DefaultCoreTaskConfig(): ResolvedCoreTaskConfig {
  let esmentry: string | undefined;
  const pkg = loadPackageJSON();
  const config: ResolvedCoreTaskConfig = {};

  if (pkg) {
    if (typeof pkg.type === 'string') {
      const type = pkg.type.toLowerCase();
      if (type === 'commonjs') config.cjs = DefaultCoreTaskConfigGetterMap.cjs;
      else if (type === 'module') config.esm = DefaultCoreTaskConfigGetterMap.esm;
    } else if (typeof pkg.main === 'string') {
      if (/\.umd\./.test(pkg.main)) config.umd = DefaultCoreTaskConfigGetterMap.umd;
      else if (pkg.main.endsWith('.mjs'))
        (config.esm = DefaultCoreTaskConfigGetterMap.esm), (esmentry = pkg.main);
      else config.cjs = DefaultCoreTaskConfigGetterMap.cjs;
    }

    if (config.esm === undefined && typeof pkg.module === 'string')
      (config.esm = DefaultCoreTaskConfigGetterMap.esm), (esmentry = pkg.module);
  }

  if (config.esm && config.umd) config.umd.input = esmentry ?? 'es/index.js';

  return config;
}

export function DefaultCoreConfig(): ResolvedCoreConfig {
  return Object.assign(
    DefaultCoreTaskConfig(),
    DefaultCoreGroupedConfigGetterMap,
    DefaultCoreSharedConfigGetterMap,
  );
}
