import type { BabelConfig } from '../babel';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface CommonJSModuleConfig extends BundleIOConfig {
  /**
   * Override babel config.
   */
  babel?: BabelConfig;
}

export interface ResolvedCommonJSModuleConfig
  extends Required<BundleIOConfig>,
    Omit<CommonJSModuleConfig, keyof BundleIOConfig> {}

export function DefaultCommonJSModuleConfig(): ResolvedCommonJSModuleConfig {
  return { ...DefaultBundleIOConfig(), outdir: 'lib' };
}
