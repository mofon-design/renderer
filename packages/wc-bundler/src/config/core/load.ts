import { asArray, iterargs } from '../../utils';
import type { CoreConfig, ResolvedCoreConfig, ResolvedCoreTaskConfig } from './interface';
import {
  DefaultCoreConfig,
  DefaultCoreGroupedConfigGetterMap,
  DefaultCoreSharedConfigGetterMap,
  DefaultCoreTaskConfigGetterMap,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadCoreConfig(configs: t.Readonly<CoreConfig[]>): ResolvedCoreConfig;
export function loadCoreConfig(...configs: t.Readonly<CoreConfig>[]): ResolvedCoreConfig;
export function loadCoreConfig(): ResolvedCoreConfig {
  // TODO load config from file
  const merged = DefaultCoreConfig();

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
        if (config[key] === undefined) {
          // ignore void config
        } else if (!config[key]) {
          merged[key] = undefined;
        } else {
          if (merged[key] === undefined) merged[key] = DefaultCoreTaskConfigGetterMap[key];
          if (typeof config[key] === 'object') {
            const source = config[key] as NonNullable<ResolvedCoreTaskConfig[typeof key]>;
            const target = merged[key] as NonNullable<ResolvedCoreTaskConfig[typeof key]>;

            for (const subkey in source) {
              if (!isKey.call(source, subkey)) continue;

              if (isKey.call(DefaultCoreSharedConfigGetterMap, subkey)) {
                target[subkey] = ([] as t.AnyArray)
                  .concat(target[subkey] || [])
                  .concat(source[subkey] || []);
              } else {
                target[subkey] = source[subkey];
              }
            }
          }
        }
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
