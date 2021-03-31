import type { BabelConfig } from '../babel';
import type { BundleIOConfig } from '../io';
import { DefaultBundleIOConfig } from '../io';

export interface ECMAScriptModuleConfig extends BundleIOConfig {
  /**
   * Override babel config.
   */
  babel?: BabelConfig;
}

export interface ResolvedECMAScriptModuleConfig
  extends Required<BundleIOConfig>,
    Omit<ECMAScriptModuleConfig, keyof BundleIOConfig> {}

export function DefaultECMAScriptModuleConfig(): ResolvedECMAScriptModuleConfig {
  return { ...DefaultBundleIOConfig(), outdir: 'es' };
}
