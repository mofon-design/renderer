import { dirname, resolve } from 'path';
import type t from 'types-lib';
import { loadPackageJSON } from '../../utils';
import type { BabelConfig } from '../babel';
import type { CommonJSModuleConfig } from '../cjs';
import type { TypeScriptDeclarationConfig } from '../dts';
import type { ECMAScriptModuleConfig } from '../esm';
import type { TypeScriptCompileConfig } from '../tsc';
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
  /**
   * Config typescript compiler.
   */
  tsc?: CoreSharedConfigItem<TypeScriptCompileConfig | false>;
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
  get tsc() {
    return [];
  },
};

export type CoreTaskConfigItem<Config> = boolean | Config | Config[];

export interface CoreTaskConfig {
  /**
   * Enable CommonJS module output.
   *
   * @default
   * const { main, type } = require('package.json');
   * const cjs = typeof type === 'string' ? type === 'commonjs' : !/(\.umd\.js|\.mjs)$/.test(main);
   */
  cjs?: CoreTaskConfigItem<CommonJSModuleConfig>;
  /**
   * Enable TypeScript declaration output.
   *
   * @default
   * const { main, module, types, typings } = require('package.json');
   * const dts =
   *   (typeof types === 'string' &&
   *     types.endsWith('.d.ts') &&
   *     !isSubdir(types, main) &&
   *     !isSubdir(types, module)) ||
   *   (typeof typings === 'string' &&
   *     typings.endsWith('.d.ts') &&
   *     !isSubdir(typings, main) &&
   *     !isSubdir(typings, module));
   */
  dts?: CoreTaskConfigItem<TypeScriptDeclarationConfig>;
  /**
   * Enable ECMAScript module output.
   *
   * @default
   * const { main, module, type } = require('package.json');
   * const esm = type === 'module' || typeof module === 'string' || main.endsWith('.mjs');
   */
  esm?: CoreTaskConfigItem<ECMAScriptModuleConfig>;
  /**
   * Enable UMD module output.
   *
   * @default
   * require('package.json').main.endsWith('.umd.js')
   */
  umd?: CoreTaskConfigItem<UMDModuleConfig>;
}

export type SingleCoreTaskConfigMap = {
  [Key in keyof CoreTaskConfig]: CoreTaskConfig[Key] extends CoreTaskConfigItem<infer Config>
    ? Config
    : CoreTaskConfig[Key];
};

export const ExtendableCoreTaskConfigGetterMap: Required<SingleCoreTaskConfigMap> = {
  get cjs() {
    return {};
  },
  get dts() {
    return {};
  },
  get esm() {
    return {};
  },
  get umd() {
    return {};
  },
};

export type ResolvedCoreTaskConfig = {
  [Key in keyof CoreTaskConfig]: Exclude<CoreTaskConfig[Key], boolean>;
};

export const DefaultCoreTaskConfigGetterMap: Required<ResolvedCoreTaskConfig> = ExtendableCoreTaskConfigGetterMap;

export interface CoreConfig extends CoreGroupedConfig, CoreSharedConfig, CoreTaskConfig {}

export interface ResolvedCoreConfig
  extends ResolvedCoreGroupedConfig,
    ResolvedCoreSharedConfig,
    ResolvedCoreTaskConfig {}

export function DefaultCoreTaskConfig(): ResolvedCoreTaskConfig {
  const pkg = loadPackageJSON();
  const config: ResolvedCoreTaskConfig = {};

  if (pkg) {
    const pkgMain = typeof pkg.main === 'string' ? pkg.main : null;
    const pkgModule = typeof pkg.module === 'string' ? pkg.module : null;
    const pkgType = typeof pkg.type === 'string' ? pkg.type.toLowerCase() : null;

    const shouldEnableDtsTask = (types: string): boolean => {
      if (!types.endsWith('.d.ts')) return false;
      const abspath = resolve(dirname(types));
      return (
        (pkgMain === null || !abspath.startsWith(resolve(dirname(pkgMain)))) &&
        (pkgModule === null || !abspath.startsWith(resolve(dirname(pkgModule))))
      );
    };

    if (pkgType !== null) {
      if (pkgType === 'commonjs') config.cjs = DefaultCoreTaskConfigGetterMap.cjs;
      else if (pkgType === 'module') config.esm = DefaultCoreTaskConfigGetterMap.esm;
    } else if (typeof pkgMain === 'string') {
      if (/\.umd\./i.test(pkgMain)) config.umd = DefaultCoreTaskConfigGetterMap.umd;
      else if (pkgMain.endsWith('.mjs')) config.esm = DefaultCoreTaskConfigGetterMap.esm;
      else config.cjs = DefaultCoreTaskConfigGetterMap.cjs;
    }

    if (config.esm === undefined && typeof pkgModule === 'string')
      config.esm = DefaultCoreTaskConfigGetterMap.esm;

    if (
      (typeof pkg.types === 'string' && shouldEnableDtsTask(pkg.types)) ||
      (typeof pkg.typings === 'string' && shouldEnableDtsTask(pkg.typings))
    )
      config.dts = DefaultCoreTaskConfigGetterMap.dts;
  }

  return config;
}

export function DefaultCoreConfig(): ResolvedCoreConfig {
  return Object.assign(
    DefaultCoreTaskConfig(),
    DefaultCoreGroupedConfigGetterMap,
    DefaultCoreSharedConfigGetterMap,
  );
}
