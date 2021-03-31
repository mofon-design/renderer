import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface ECMAScriptModuleConfig extends BundleIOConfig, CoreSharedConfig {}

export interface ResolvedECMAScriptModuleConfig
  extends Required<BundleIOConfig>,
    Omit<ECMAScriptModuleConfig, keyof BundleIOConfig> {}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  return Object.assign(DefaultBundleIOConfig(), { outdir: 'es' });
}
