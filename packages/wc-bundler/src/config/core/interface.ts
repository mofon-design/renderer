import { loadPackageJSON } from '../../utils';
import type { BabelConfig } from '../babel';
import { DefaultBuiltinBabelPresetsConfig } from '../babel';
import type { CommonJSModuleConfig } from '../cjs';
import { DefaultCommonJSModuleConfig } from '../cjs';
import type { ECMAScriptModuleConfig } from '../esm';
import { DefaultECMAScriptModuleConfig } from '../esm';
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

export const DefaultCoreGroupedConfigMap: Required<ResolvedCoreGroupedConfig> = {
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

export const DefaultCoreSharedConfigMap: ResolvedCoreSharedConfig = {
  get babel() {
    return [DefaultBuiltinBabelPresetsConfig()];
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

export const DefaultCoreTaskConfigMap: Required<ResolvedCoreTaskConfig> = {
  get cjs() {
    return DefaultCommonJSModuleConfig();
  },
  get esm() {
    return DefaultECMAScriptModuleConfig();
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
  const pkg = loadPackageJSON();
  const config: ResolvedCoreTaskConfig = {};

  if (pkg) {
    if (typeof pkg.type === 'string') {
      const type = pkg.type.toLowerCase();
      if (type === 'commonjs') config.cjs = DefaultCoreTaskConfigMap.cjs;
      else if (type === 'module') config.esm = DefaultCoreTaskConfigMap.esm;
    } else if (typeof pkg.main === 'string') {
      if (pkg.main.endsWith('.umd.js')) config.umd = DefaultCoreTaskConfigMap.umd;
      else if (pkg.main.endsWith('.mjs')) config.esm = DefaultCoreTaskConfigMap.esm;
      else config.cjs = DefaultCoreTaskConfigMap.cjs;
    }

    if (config.esm === undefined && typeof pkg.module === 'string') {
      config.esm = DefaultCoreTaskConfigMap.esm;
    }
  }

  return config;
}

export function DefaultCoreConfig(): ResolvedCoreConfig {
  return Object.assign(
    DefaultCoreTaskConfig(),
    DefaultCoreGroupedConfigMap,
    DefaultCoreSharedConfigMap,
  );
}
