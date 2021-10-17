import { dirname, relative, resolve } from 'path';
import { asArray, iterargs, loadModuleByBabel, resolveModuleByBabel } from '../../utils';
import type t from 'types-lib';
import type {
  CoreConfig,
  CoreTaskConfig,
  ResolvedCoreConfig,
  ResolvedCoreTaskConfig,
} from './interface';
import {
  ExtendableCoreTaskConfigGetterMap,
  DefaultCoreConfig,
  DefaultCoreGroupedConfigGetterMap,
  DefaultCoreSharedConfigGetterMap,
  DefaultCoreTaskConfigGetterMap,
  SingleCoreTaskConfigMap,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadCoreConfig(configs: t.Readonly<CoreConfig[]>): ResolvedCoreConfig;
export function loadCoreConfig(...configs: t.Readonly<CoreConfig>[]): ResolvedCoreConfig;
export function loadCoreConfig(): ResolvedCoreConfig {
  const cwd = process.cwd();
  const merged = DefaultCoreConfig();
  const extendableTaskConfigMap = Object.assign({}, ExtendableCoreTaskConfigGetterMap);

  for (const config of iterargs<t.Readonly<CoreConfig>>(arguments)) {
    const configSourceDirectory = config.__configSourcePath
      ? dirname(config.__configSourcePath)
      : null;

    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultCoreGroupedConfigGetterMap, key)) {
        if (configSourceDirectory && relative(configSourceDirectory, cwd) !== '') continue;

        if (config[key] === undefined) {
          // ignore void config
        } else if (!config[key]) {
          merged[key] = undefined;
        } else {
          if (merged[key] === undefined) merged[key] = DefaultCoreGroupedConfigGetterMap[key];
          if (typeof config[key] === 'object') Object.assign(merged[key], config[key]);
        }
      } else if (isKey.call(DefaultCoreTaskConfigGetterMap, key)) {
        mergeCoreTaskConfig(key, merged, config as CoreConfig, extendableTaskConfigMap);
      } else if (isKey.call(DefaultCoreSharedConfigGetterMap, key)) {
        // shared config
        if (config[key]) {
          merged[key] = (merged[key] as t.AnyArray).concat(
            asArray(config[key] as NonNullable<CoreConfig[typeof key]>),
          );
        }
      }
    }
  }

  for (const key in DefaultCoreTaskConfigGetterMap) {
    if (!isKey.call(DefaultCoreTaskConfigGetterMap, key)) continue;

    asArray<t.AnyRecord>(merged[key] ?? []).forEach((target) => {
      for (const sharedKey in DefaultCoreSharedConfigGetterMap) {
        if (isKey.call(DefaultCoreSharedConfigGetterMap, sharedKey)) {
          target[sharedKey] = (merged[sharedKey] as t.AnyArray).concat(target[sharedKey] || []);
        }
      }
    });
  }

  return merged;
}

function mergeCoreTaskConfig<Task extends keyof ResolvedCoreTaskConfig>(
  task: Task,
  target: ResolvedCoreTaskConfig,
  source: CoreTaskConfig,
  extendableTaskConfigMap: Required<SingleCoreTaskConfigMap>,
): void {
  let targetValue = target[task];
  const sourceValue = source[task];

  // ignore void config
  if (sourceValue === undefined) return;

  if (!sourceValue) {
    // disable task
    target[task] = undefined;
    // reset upstream
    extendableTaskConfigMap[task] = ExtendableCoreTaskConfigGetterMap[task];
    return;
  }

  // load default config
  if (targetValue === undefined) targetValue = target[task] = DefaultCoreTaskConfigGetterMap[task];

  // sourceValue is boolean
  if (typeof sourceValue !== 'object') return;

  // single config
  if (!Array.isArray(sourceValue)) {
    mergeCoreTaskConfigContent(extendableTaskConfigMap[task], sourceValue);

    if (!Array.isArray(targetValue))
      return void mergeCoreTaskConfigContent(targetValue, sourceValue);

    return targetValue.forEach((targetItem) => {
      mergeCoreTaskConfigContent(targetItem, sourceValue);
    });
  }

  const extendsSource: NonNullable<
    SingleCoreTaskConfigMap[keyof SingleCoreTaskConfigMap]
  > = Array.isArray(targetValue) ? extendableTaskConfigMap[task] : targetValue;

  target[task] = sourceValue.map((sourceItem) => {
    return mergeCoreTaskConfigContent(mergeCoreTaskConfigContent({}, extendsSource), sourceItem);
  });
}

function mergeCoreTaskConfigContent(
  target: NonNullable<SingleCoreTaskConfigMap[keyof SingleCoreTaskConfigMap]>,
  source: NonNullable<SingleCoreTaskConfigMap[keyof SingleCoreTaskConfigMap]>,
): NonNullable<SingleCoreTaskConfigMap[keyof SingleCoreTaskConfigMap]> {
  for (const key in source) {
    if (!isKey.call(source, key)) continue;

    if (source[key] === undefined) {
      // ignore void config
    } else if (isKey.call(DefaultCoreSharedConfigGetterMap, key)) {
      target[key] = asArray(target[key] ?? []).concat((source[key] as never) ?? []);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

export function loadCoreConfigFiles(
  files: boolean | string | null | undefined | readonly string[],
): t.Readonly<CoreConfig[]> {
  if (typeof files === 'string') {
    const abspath = resolveModuleByBabel(files);
    if (!abspath) return [];

    const exports = loadModuleByBabel(abspath);
    if (!isAnyRecord(exports)) return [];

    let config: t.AnyRecord;
    if (isAnyRecord(exports.config)) config = exports.config;
    else if (isAnyRecord(exports.default)) config = exports.default;
    else return [];

    return [Object.assign({}, config, { __configSourcePath: abspath })];
  }

  if (!files) return [];
  if ((Array.isArray as t.Array.isArray)(files))
    return files.map((file) => loadCoreConfigFiles(file)).flat(1);
  return loadCoreConfigFiles([resolve('.wc-bundlerrc'), resolve('wc-bundler.config')]);

  function isAnyRecord(input: unknown): input is t.AnyRecord {
    return typeof input === 'object' && input !== null;
  }
}
