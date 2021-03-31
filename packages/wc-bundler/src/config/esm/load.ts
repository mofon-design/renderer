import type { ECMAScriptModuleConfig, ResolvedECMAScriptModuleConfig } from './interface';
import { DefaultECMAScriptModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadECMAScriptModuleConfig(
  config: t.Readonly<ECMAScriptModuleConfig> | undefined,
): ResolvedECMAScriptModuleConfig {
  const merged = DefaultECMAScriptModuleConfig();

  if (config) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;
      if (config[key] !== undefined) merged[key] = config[key] as never;
    }
  }

  return merged;
}
