import type { TransformOptions as BabelTransformOptions } from '@babel/core';
import { iterargs } from '../../utils';
import type { BabelConfig, ResolvedBuiltinBabelPresetsConfig } from './interface';
import {
  BuiltinBabelPresetsNameMap,
  DefaultBabelEnvConfig,
  DefaultBabelMinifyConfig,
  DefaultBabelMinifyPluginsConfig,
  DefaultBabelPluginsConfig,
  DefaultBabelPresetsConfig,
  DefaultBabelTypeScriptConfig,
  DefaultBuiltinBabelPresetsConfig,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const BuiltinPresetConfig: Required<ResolvedBuiltinBabelPresetsConfig> = {
  get env() {
    return DefaultBabelEnvConfig();
  },
  get minify() {
    return DefaultBabelMinifyConfig();
  },
  get typescript() {
    return DefaultBabelTypeScriptConfig();
  },
};

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

export function transformBabelConfig(configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function transformBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function transformBabelConfig(): BabelTransformOptions {
  const merged: BabelTransformOptions = {};
  const builtinpreset = DefaultBuiltinBabelPresetsConfig();
  const repeatable = { plugins: DefaultBabelPluginsConfig(), presets: DefaultBabelPresetsConfig() };

  for (const config of iterargs<t.Readonly<BabelConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(BuiltinPresetConfig, key)) {
        if (config[key] === undefined) {
          // ignore void preset config
          // e.g. typescript: if !detectFile('tsconfig.json') then undefined
        } else if (!config[key]) {
          builtinpreset[key] = undefined;
        } else {
          if (!isKey.call(builtinpreset, key)) builtinpreset[key] = BuiltinPresetConfig[key];
          if (typeof config[key] === 'object') Object.assign(builtinpreset[key], config[key]);
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

  Object.assign(merged, repeatable);

  return merged;
}
