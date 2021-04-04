import type { RollupOptions, Plugin as RollupPlugin } from 'rollup';
import { asArray, iterargs } from '../../utils';
import {
  DefaultRollupBabelConfig,
  ResolvedBuiltinRollupPluginsConfig,
  RollupConfig,
} from './interface';
import {
  BuiltinRollupPluginsMap,
  DefaultBuiltinRollupPluginsConfig,
  DefaultRollupCommonJSConfig,
  DefaultRollupJsonConfig,
  DefaultRollupNodeResolveConfig,
  DefaultRollupTerserConfig,
  DefaultRollupUrlConfig,
} from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const BuiltinRollupPluginConfigGetters: Required<ResolvedBuiltinRollupPluginsConfig> = {
  get babel() {
    return DefaultRollupBabelConfig();
  },
  get cjs() {
    return DefaultRollupCommonJSConfig();
  },
  get json() {
    return DefaultRollupJsonConfig();
  },
  get nodeResolve() {
    return DefaultRollupNodeResolveConfig();
  },
  get terser() {
    return DefaultRollupTerserConfig();
  },
  get url() {
    return DefaultRollupUrlConfig();
  },
};

export function loadRollupConfig(configs: t.Readonly<RollupConfig[]>): RollupOptions;
export function loadRollupConfig(...configs: t.Readonly<RollupConfig[]>): RollupOptions;
export function loadRollupConfig(): RollupOptions {
  const merged: RollupOptions = {};
  const plugins: RollupPlugin[] = [];
  const builtinplugins = DefaultBuiltinRollupPluginsConfig();

  for (const config of iterargs<t.Readonly<RollupConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(BuiltinRollupPluginConfigGetters, key)) {
        if (config[key] === undefined) {
          // ignore void preset config
        } else if (!config[key]) {
          builtinplugins[key] = undefined;
        } else {
          if (builtinplugins[key] === undefined)
            Object.assign(builtinplugins, { [key]: BuiltinRollupPluginConfigGetters[key] });
          if (typeof config[key] === 'object') Object.assign(builtinplugins[key], config[key]);
        }
      } else if (key === 'plugins') {
        plugins.push.apply(plugins, asArray(config[key] || []) as RollupPlugin[]);
      } else {
        (merged as t.UnknownRecord)[key] = config[key];
      }
    }
  }

  for (const key in builtinplugins) {
    if (isKey.call(builtinplugins, key) && builtinplugins[key] !== undefined) {
      plugins.unshift(BuiltinRollupPluginsMap[key](builtinplugins[key] as never));
    }
  }

  merged.plugins = plugins;

  return merged;
}
