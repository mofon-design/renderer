import { asArray } from '../../utils';
import { DefaultCoreSharedConfigGetterMap } from '../core';
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

      if (config[key] === undefined) {
        // ignore void config
      } else if (isKey.call(DefaultCoreSharedConfigGetterMap, key)) {
        merged[key] = asArray(merged[key] ?? []).concat(config[key] as never);
      } else if (key === 'exts') {
        const source = config[key];
        const target = merged[key];
        for (const subkey in source) {
          if (isKey.call(source, subkey)) {
            const value = source[subkey];
            if (value) target[subkey] = value as typeof target[typeof subkey];
          }
        }
      } else {
        merged[key] = config[key] as never;
      }
    }
  }

  return merged;
}
