import { asArray, iterargs } from '../../utils';
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
  // TODO load config from file
  const merged = DefaultCoreConfig();
  const extendableTaskConfigMap = Object.assign({}, ExtendableCoreTaskConfigGetterMap);

  for (const config of iterargs<t.Readonly<CoreConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultCoreGroupedConfigGetterMap, key)) {
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

    const target = merged[key] as t.UnknownRecord | undefined;
    if (target !== undefined) {
      for (const sharedKey in DefaultCoreSharedConfigGetterMap) {
        if (isKey.call(DefaultCoreSharedConfigGetterMap, sharedKey)) {
          target[sharedKey] = (merged[sharedKey] as t.AnyArray).concat(target[sharedKey] || []);
        }
      }
    }
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
