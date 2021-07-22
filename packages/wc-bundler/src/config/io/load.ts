import type t from 'types-lib';
import type { BundleIOConfig, ResolvedBundleIOConfig } from './interface';
import { DefaultBundleIOConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadBundleIOConfig(
  config: t.Readonly<BundleIOConfig> | undefined,
): ResolvedBundleIOConfig {
  const merged = DefaultBundleIOConfig();

  if (config) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;
      if (config[key] !== undefined) merged[key] = config[key] as never;
    }
  }

  return merged;
}
