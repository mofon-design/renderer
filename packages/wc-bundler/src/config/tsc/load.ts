import { dirname, resolve } from 'path';
import { iterargs } from 'src/utils';
import ts from 'typescript';
import type { TypeScriptCompileConfig } from './interface';
import { DefaultTypeScriptCompileConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadTypeScriptCompileConfig(
  configs: t.Readonly<TypeScriptCompileConfig[]>,
): Partial<ts.ParsedCommandLine> | false;
export function loadTypeScriptCompileConfig(
  ...configs: t.Readonly<TypeScriptCompileConfig>[]
): Partial<ts.ParsedCommandLine> | false;
export function loadTypeScriptCompileConfig(): Partial<ts.ParsedCommandLine> | false {
  let merged = DefaultTypeScriptCompileConfig();

  for (const config of iterargs<t.Readonly<TypeScriptCompileConfig>>(arguments)) {
    if (!config) {
      merged = false;
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

  if (!merged) return false;

  const cwd = process.cwd();
  const compilerOptions = ts.convertCompilerOptionsFromJson(merged.compilerOptions || {}, cwd);

  if (!merged.configFilePath) return compilerOptions;

  merged.configFilePath = resolve(merged.configFilePath);
  const tsConfig = ts.readConfigFile(merged.configFilePath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(
    tsConfig.config || {},
    ts.sys,
    dirname(merged.configFilePath),
    compilerOptions.options,
    merged.configFilePath,
  );
}
