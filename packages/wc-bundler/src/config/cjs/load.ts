import type { CommonJSModuleConfig, ResolvedCommonJSModuleConfig } from './interface';
import { DefaultCommonJSModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadCommonJSModuleConfig(
  config: t.Readonly<CommonJSModuleConfig> | undefined,
): ResolvedCommonJSModuleConfig {
  const merged = DefaultCommonJSModuleConfig();

  if (config) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;
      if (config[key] !== undefined) merged[key] = config[key] as never;
      // TODO exts
    }
  }

  return merged;
}
