import type {
  PluginItem as BabelPluginItem,
  TransformOptions as BabelTransformOptions,
} from '@babel/core';
import { loadPartialConfig } from '@babel/core';
import type t from 'types-lib';
import { iterargs } from '../../utils';
import type { BabelConfig, ResolvedBuiltinBabelPresetsConfig } from './interface';
import {
  BuiltinBabelPluginsNameMap,
  BuiltinBabelPresetsNameMap,
  DefaultBabelConfig,
  DefaultBabelMinifyPluginsConfig,
  DefaultBuiltinBabelPluginsConfigGetterMap,
  DefaultBuiltinBabelPresetsConfigGetterMap,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const TransformBuiltinPresetConfig: {
  [Key in keyof ResolvedBuiltinBabelPresetsConfig]: (
    config: NonNullable<ResolvedBuiltinBabelPresetsConfig[Key]>,
  ) => void;
} = {
  minify(config) {
    if (config.only?.length) {
      for (const key in config) {
        if (!isKey.call(config, key)) continue;
        if (!isKey.call(DefaultBabelMinifyPluginsConfig.readonly, key)) continue;
        if (!config.only.includes(key)) delete config[key];
      }
    }
  },
};

export function loadBabelConfig(configs: t.Readonly<BabelConfig[]>): BabelTransformOptions;
export function loadBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelTransformOptions;
export function loadBabelConfig(): BabelTransformOptions {
  return loadBabelConfigFromRaw(loadRawBabelConfig.apply(null, arguments as never));
}

loadBabelConfig.raw = loadRawBabelConfig;
loadBabelConfig.fromRaw = loadBabelConfigFromRaw;

type RepeatableConfig = { [Key in 'plugins' | 'presets']: NonNullable<BabelTransformOptions[Key]> };

export function loadBabelConfigFromRaw(raw: BabelConfig): BabelTransformOptions {
  const merged: BabelTransformOptions = {};
  const repeatable: RepeatableConfig = { plugins: [], presets: [] };

  for (const key in raw) {
    if (!isKey.call(raw, key)) continue;

    if (
      isKey.call(DefaultBuiltinBabelPluginsConfigGetterMap, key) ||
      isKey.call(DefaultBuiltinBabelPresetsConfigGetterMap, key)
    )
      continue;

    if (isKey.call(repeatable, key)) {
      repeatable[key] = repeatable[key].concat(raw[key] ?? []);
    } else {
      (merged as t.UnknownRecord)[key] = raw[key];
    }
  }

  unshiftBuiltinPluginsOrPresetsConfig(BuiltinBabelPluginsNameMap, raw, repeatable.plugins);
  unshiftBuiltinPluginsOrPresetsConfig(BuiltinBabelPresetsNameMap, raw, repeatable.presets);

  return loadPartialConfig(Object.assign(merged, repeatable))?.options ?? {};
}

export function loadRawBabelConfig(configs: t.Readonly<BabelConfig[]>): BabelConfig;
export function loadRawBabelConfig(...configs: t.Readonly<BabelConfig>[]): BabelConfig;
export function loadRawBabelConfig(): BabelConfig {
  const merged: BabelConfig = DefaultBabelConfig();
  const repeatable: RepeatableConfig = { plugins: [], presets: [] };

  for (const config of iterargs<t.Readonly<BabelConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultBuiltinBabelPresetsConfigGetterMap, key)) {
        mergeBuiltinPluginOrPresetConfig(
          DefaultBuiltinBabelPresetsConfigGetterMap,
          config,
          merged,
          key,
        );
      } else if (isKey.call(DefaultBuiltinBabelPluginsConfigGetterMap, key)) {
        mergeBuiltinPluginOrPresetConfig(
          DefaultBuiltinBabelPluginsConfigGetterMap,
          config,
          merged,
          key,
        );
      } else if (isKey.call(repeatable, key)) {
        repeatable[key] = repeatable[key].concat(config[key] ?? []);
      } else {
        (merged as t.UnknownRecord)[key] = config[key];
      }
    }
  }

  for (const key in TransformBuiltinPresetConfig) {
    if (!isKey.call(TransformBuiltinPresetConfig, key)) continue;
    const transformer = TransformBuiltinPresetConfig[key];
    if (transformer && merged[key]) transformer(merged[key] as never);
  }

  return Object.assign(merged, repeatable);
}

function mergeBuiltinPluginOrPresetConfig<
  Key extends string,
  DefaultsGetter extends Readonly<t.AnyRecord<Key>>
>(
  getter: DefaultsGetter,
  source: { readonly [Key in keyof DefaultsGetter]?: t.Readonly<DefaultsGetter[Key]> | boolean },
  target: { [Key in keyof DefaultsGetter]?: t.Readonly<DefaultsGetter[Key]> | boolean },
  key: Key,
): void {
  // ignore void plugin config
  if (source[key] === undefined) return;

  if (!source[key]) {
    target[key] = false;
    return;
  }

  if (!target[key] || typeof target[key] !== 'object') target[key] = getter[key];

  if (typeof source[key] === 'object') {
    if (typeof target[key] === 'object') Object.assign(target[key], source[key]);
    else target[key] = source[key];
  }
}

function unshiftBuiltinPluginsOrPresetsConfig<
  Key extends string,
  Source extends Readonly<Partial<t.AnyRecord<Key>>>
>(nameMap: Readonly<Record<Key, string>>, source: Source, target: BabelPluginItem[]): void {
  (Object.entries(nameMap) as [Key, string][]).reverse().forEach(([key, name]) => {
    const config = source[key];
    if (config) target.unshift(typeof config === 'object' ? [name, config] : name);
  });
}
