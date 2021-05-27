import type { TypeScriptDeclarationConfig, ResolvedTypeScriptDeclarationConfig } from './interface';
import { DefaultTypeScriptDeclarationConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadTypeScriptDeclarationConfig(
  config: t.Readonly<TypeScriptDeclarationConfig> | undefined,
): ResolvedTypeScriptDeclarationConfig {
  const merged = DefaultTypeScriptDeclarationConfig();

  if (config) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;
      if (config[key] !== undefined) merged[key] = config[key] as never;
    }
  }

  return merged;
}
