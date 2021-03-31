import type { CoreSharedConfig } from '../core';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface CommonJSModuleConfig extends BundleIOConfig, CoreSharedConfig {}

export interface ResolvedCommonJSModuleConfig
  extends Required<BundleIOConfig>,
    Omit<CommonJSModuleConfig, keyof BundleIOConfig> {}

export function DefaultCommonJSModuleConfig(): ResolvedCommonJSModuleConfig {
  return Object.assign(DefaultBundleIOConfig(), { outdir: 'lib' });
}
