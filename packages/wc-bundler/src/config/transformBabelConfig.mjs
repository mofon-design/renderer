import type {
  PluginItem as BabelPluginItem,
  TransformOptions as BabelTransformOptions,
} from '@babel/core';
import type { BabelConfig } from './interface';
import {
  DefaultBabelEnvConfig,
  DefaultBabelMinifyConfig,
  DefaultBabelPluginsConfig,
  DefaultBabelPresetsConfig,
  DefaultBabelTypeScriptConfig,
} from './interface';

const isKey = Object.prototype.hasOwnProperty;

const PresetConfig: BabelConfig = {
  env: DefaultBabelEnvConfig,
  minify: DefaultBabelMinifyConfig,
  typescript: DefaultBabelTypeScriptConfig,
};

const PluginConfig: BabelConfig = {
  plugins: DefaultBabelPluginsConfig,
  presets: DefaultBabelPresetsConfig,
};

export function transformBabelConfig(...configs: BabelConfig[]): BabelTransformOptions {
  const merged: BabelTransformOptions = {};
  const repeatable: Record<string, BabelPluginItem[]> = {};

  for (const config of configs) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(PresetConfig, key)) {
        if (!config[key]) {
          merged[key] = undefined;
        } else {
          if (!isKey.call(merged, key)) merged[key] = PresetConfig[key];
          if (typeof config[key] === 'object') Object.assign(merged[key], config[key]);
        }
      } else if (isKey.call(PluginConfig, key)) {
        if (!isKey.call(repeatable, key)) repeatable[key] = PluginConfig[key];
        repeatable[key] = repeatable[key].concat(config[key]);
      } else {
        merged[key] = config[key];
      }
    }
  }

  Object.assign(merged, repeatable);

  return merged;
}
