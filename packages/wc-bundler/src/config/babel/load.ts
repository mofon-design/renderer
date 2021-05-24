import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import { loadPartialConfig } from '@babel/core';
import { iterargs } from '../../utils';
import type { BabelConfig, ResolvedBuiltinBabelPresetsConfig } from './interface';
import {
  BuiltinBabelPluginsNameMap,
  BuiltinBabelPresetsNameMap,
  DefaultBabelMinifyPluginsConfig,
  DefaultBabelPluginsConfig,
  DefaultBabelPresetsConfig,
  DefaultBuiltinBabelPluginsConfig,
  DefaultBuiltinBabelPluginsConfigGetterMap,
  DefaultBuiltinBabelPresetsConfig,
  DefaultBuiltinBabelPresetsConfigGetterMap,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const TransformBuiltinPresetConfig: {
  [Key in keyof ResolvedBuiltinBabelPresetsConfig]-?: (
    config: NonNullable<ResolvedBuiltinBabelPresetsConfig[Key]>,
  ) => void;
} = {
  env() {},
  minify(config) {
    if (config.only?.length) {
      for (const key in config) {
        if (!isKey.call(config, key)) continue;
        if (!isKey.call(DefaultBabelMinifyPluginsConfig.readonly, key)) continue;
        if (!config.only.includes(key)) delete config[key];
      }
    }
  },
  typescript() {},
};

export function loadBabelConfig(configs: t.Readonly<BabelConfig[]>): BabelTransformOptions;
export function loadBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(): BabelTransformOptions {
  return loadPartialConfig(loadRawBabelConfig.apply(null, arguments as never))?.options ?? {};
}

loadBabelConfig.raw = loadRawBabelConfig;

export function loadRawBabelConfig(configs: t.Readonly<BabelConfig[]>): BabelTransformOptions;
export function loadRawBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadRawBabelConfig(): BabelTransformOptions {
  const merged: BabelTransformOptions = {};
  const builtinplugin = DefaultBuiltinBabelPluginsConfig();
  const builtinpreset = DefaultBuiltinBabelPresetsConfig();
  const repeatable = { plugins: DefaultBabelPluginsConfig(), presets: DefaultBabelPresetsConfig() };

  for (const config of iterargs<t.Readonly<BabelConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultBuiltinBabelPresetsConfigGetterMap, key)) {
        if (config[key] === undefined) {
          // ignore void preset config
          // e.g. typescript: if !detectFile('tsconfig.json') then undefined
        } else if (!config[key]) {
          builtinpreset[key] = undefined;
        } else {
          if (builtinpreset[key] === undefined)
            builtinpreset[key] = DefaultBuiltinBabelPresetsConfigGetterMap[key];
          if (typeof config[key] === 'object') Object.assign(builtinpreset[key], config[key]);
        }
      } else if (isKey.call(DefaultBuiltinBabelPluginsConfigGetterMap, key)) {
        if (config[key] === undefined) {
          // ignore void plugin config
        } else if (!config[key]) {
          builtinplugin[key] = undefined;
        } else {
          if (builtinplugin[key] === undefined)
            builtinplugin[key] = DefaultBuiltinBabelPluginsConfigGetterMap[key] as never;
          if (typeof config[key] === 'object') {
            if (typeof builtinplugin[key] === 'object')
              Object.assign(builtinplugin[key], config[key]);
            else builtinplugin[key] = config[key] as never;
          }
        }
      } else if (isKey.call(repeatable, key)) {
        repeatable[key] = repeatable[key].concat(config[key] ?? []);
      } else {
        (merged as t.UnknownRecord)[key] = config[key];
      }
    }
  }

  for (const key in builtinpreset) {
    if (isKey.call(builtinpreset, key) && builtinpreset[key] !== undefined) {
      TransformBuiltinPresetConfig[key](
        builtinpreset[key] as NonNullable<ResolvedBuiltinBabelPresetsConfig[typeof key]>,
      );
      repeatable.presets.unshift([BuiltinBabelPresetsNameMap[key], builtinpreset[key]]);
    }
  }

  Object.keys(BuiltinBabelPluginsNameMap)
    .reverse()
    .forEach((key) => {
      if (isKey.call(BuiltinBabelPluginsNameMap, key) && builtinplugin[key] !== undefined) {
        if (typeof builtinplugin[key] === 'object')
          repeatable.plugins.unshift([BuiltinBabelPluginsNameMap[key], builtinplugin[key]]);
        else repeatable.plugins.unshift(BuiltinBabelPluginsNameMap[key]);
      }
    });

  Object.assign(merged, repeatable);

  return merged;
}
