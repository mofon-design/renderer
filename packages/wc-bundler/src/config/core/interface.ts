import type { BabelConfig } from '../babel';
import type { CommonJSModuleConfig } from '../cjs';
import { DefaultCommonJSModuleConfig } from '../cjs';
import type { ECMAScriptModuleConfig } from '../esm';
import { DefaultECMAScriptModuleConfig } from '../esm';
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
    return [];
  },
};

export interface CoreTaskConfig {
  /**
   * Enable CommonJS module output.
   */
  cjs?: boolean | CommonJSModuleConfig;
  /**
   * Enable ECMAScript module output.
   */
  esm?: boolean | ECMAScriptModuleConfig;
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
};

export interface CoreConfig extends CoreGroupedConfig, CoreSharedConfig, CoreTaskConfig {}

export interface ResolvedCoreConfig
  extends ResolvedCoreGroupedConfig,
    ResolvedCoreSharedConfig,
    ResolvedCoreTaskConfig {}

export function DefaultCoreConfig(): ResolvedCoreConfig {
  return Object.assign(
    {},
    DefaultCoreGroupedConfigMap,
    DefaultCoreSharedConfigMap,
    DefaultCoreTaskConfigMap,
  );
}
