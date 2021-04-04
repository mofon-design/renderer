import { asArray, iterargs } from '../../utils';
import type { CoreConfig, ResolvedCoreConfig, ResolvedCoreTaskConfig } from './interface';
import {
  DefaultCoreConfig,
  DefaultCoreGroupedConfigMap,
  DefaultCoreSharedConfigMap,
  DefaultCoreTaskConfigMap,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

export function loadCoreConfig(configs: t.Readonly<CoreConfig>[]): ResolvedCoreConfig;
export function loadCoreConfig(...configs: t.Readonly<CoreConfig>[]): ResolvedCoreConfig;
export function loadCoreConfig(): ResolvedCoreConfig {
  const lazy: (() => void)[] = [];
  const merged = DefaultCoreConfig();

  for (const config of iterargs<t.Readonly<CoreConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultCoreGroupedConfigMap, key)) {
        if (config[key] === undefined) {
          // ignore void config
        } else if (!config[key]) {
          merged[key] = undefined;
        } else {
          if (merged[key] === undefined) merged[key] = DefaultCoreGroupedConfigMap[key];
          if (typeof config[key] === 'object') Object.assign(merged[key], config[key]);
        }
      } else if (isKey.call(DefaultCoreTaskConfigMap, key)) {
        if (config[key] === undefined) {
          // ignore void config
        } else if (!config[key]) {
          merged[key] = undefined;
        } else {
          if (merged[key] === undefined) merged[key] = DefaultCoreTaskConfigMap[key];
          if (typeof config[key] === 'object') {
            const source = config[key] as NonNullable<ResolvedCoreTaskConfig[typeof key]>;

            for (const subkey in source) {
              if (!isKey.call(source, subkey)) continue;
              if (isKey.call(DefaultCoreSharedConfigMap, subkey)) {
                if (source[subkey]) {
                  const ref = asArray(source[subkey] as t.AnyArray);
                  // lazy merge shared config
                  lazy.push(() => {
                    const target = merged[key];
                    if (target !== undefined) {
                      target[subkey] = (merged[subkey] as t.AnyArray).concat(ref);
                    }
                  });
                }
              } else {
                (merged[key] as t.UnknownRecord)[subkey] = source[subkey];
              }
            }
          }
        }
      } else if (isKey.call(DefaultCoreSharedConfigMap, key)) {
        // shared config
        if (config[key]) {
          merged[key] = (merged[key] as t.AnyArray).concat(
            asArray(config[key] as NonNullable<CoreConfig[typeof key]>),
          );
        }
      }
    }
  }

  lazy.forEach((effect) => effect());

  for (const key in DefaultCoreTaskConfigMap) {
    if (!isKey.call(DefaultCoreTaskConfigMap, key)) continue;
    const source = merged[key] as t.UnknownRecord | undefined;
    if (source !== undefined) {
      for (const sharedKey in DefaultCoreSharedConfigMap) {
        if (!isKey.call(DefaultCoreSharedConfigMap, sharedKey)) continue;
        if (!isKey.call(source, sharedKey) || source[sharedKey] === undefined) {
          source[sharedKey] = merged[sharedKey].concat();
        }
      }
    }
  }

  return merged;
}
