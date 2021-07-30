import { dirname, resolve } from 'path';
import type t from 'types-lib';
import { iterargs } from '../../utils';
import ts from 'typescript';
import { CompilerOptionsEnumMap } from './compiler-options-enum-map';
import type {
  ParsedTypeScriptCompileConfig,
  ResolvedTypeScriptCompileConfig,
  TypeScriptCompileConfig,
  TypeScriptCompilerOptions,
} from './interface';
import { AllowedCompilerOptions, DefaultTypeScriptCompileConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadTypeScriptCompileConfig(
  configs: t.Readonly<(TypeScriptCompileConfig | false)[]>,
): ResolvedTypeScriptCompileConfig | null;
export function loadTypeScriptCompileConfig(
  ...configs: t.Readonly<TypeScriptCompileConfig | false>[]
): ResolvedTypeScriptCompileConfig | null;
export function loadTypeScriptCompileConfig(): ResolvedTypeScriptCompileConfig | null {
  let merged = DefaultTypeScriptCompileConfig() || null;

  for (const config of iterargs<t.Readonly<TypeScriptCompileConfig>>(arguments)) {
    if (!config) {
      merged = null;
      continue;
    }

    if (!merged) {
      merged = DefaultTypeScriptCompileConfig() || {};
    }

    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (key === 'compilerOptions') {
        if (config[key]) {
          merged[key] = Object.assign(merged[key] || {}, config[key]);
        }
      } else {
        if (config[key] === undefined) {
          // ignore void config
        } else {
          merged[key] = config[key];
        }
      }
    }
  }

  if (!merged) return null;

  const cwd = process.cwd();
  const converted: ParsedTypeScriptCompileConfig = ts.convertCompilerOptionsFromJson(
    merged.compilerOptions || {},
    cwd,
  );

  if (!merged.configFilePath)
    return { loaded: convertCompilerOptionsBack(converted.options || {}), parsed: converted };

  merged.configFilePath = resolve(merged.configFilePath);
  const tsConfig = ts.readConfigFile(merged.configFilePath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    tsConfig.config || {},
    ts.sys,
    dirname(merged.configFilePath),
    converted.options,
    merged.configFilePath,
  );

  return { loaded: convertCompilerOptionsBack(parsed.options), parsed };
}

function convertCompilerOptionsBack(
  compilerOptions: ts.CompilerOptions,
): TypeScriptCompilerOptions {
  const converted: TypeScriptCompilerOptions = {};

  for (const key in compilerOptions) {
    if (
      // !isKey.call(compilerOptions, key) ||
      !isKey.call(AllowedCompilerOptions, key) ||
      !AllowedCompilerOptions[key]
    )
      continue;

    if (isKey.call(CompilerOptionsEnumMap, key)) {
      const value = compilerOptions[key];
      (converted as t.UnknownRecord)[key] =
        typeof value === 'number' ? (CompilerOptionsEnumMap as t.AnyRecord)[key][value] : value;
    } else if (key === 'lib' && Array.isArray(compilerOptions[key])) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      converted[key] = compilerOptions[key]!.map((value) => value.toLowerCase());
    } else if (compilerOptions[key] !== undefined) {
      converted[key] = compilerOptions[key] as never;
    }
  }

  return converted;
}
