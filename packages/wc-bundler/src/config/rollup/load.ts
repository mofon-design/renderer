import type { Plugin as RollupPlugin } from 'rollup';
import { asArray, iterargs, json, signale } from '../../utils';
import {
  DefaultRollupBabelConfig,
  DefaultRollupConfig,
  ResolvedRollupConfig,
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

const BuiltinRollupPluginConfigGetterMap: Required<ResolvedBuiltinRollupPluginsConfig> = {
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

export function loadRollupConfig(configs: t.Readonly<RollupConfig[]>): ResolvedRollupConfig;
export function loadRollupConfig(...configs: t.Readonly<RollupConfig>[]): ResolvedRollupConfig;
export function loadRollupConfig(): ResolvedRollupConfig {
  const plugins: RollupPlugin[] = [];
  const merged: ResolvedRollupConfig = DefaultRollupConfig();
  const builtinplugins = DefaultBuiltinRollupPluginsConfig();

  for (const config of iterargs<t.Readonly<RollupConfig>>(arguments)) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(BuiltinRollupPluginConfigGetterMap, key)) {
        if (config[key] === undefined) {
          // ignore void preset config
        } else if (!config[key]) {
          builtinplugins[key] = undefined;
        } else {
          if (builtinplugins[key] === undefined)
            Object.assign(builtinplugins, { [key]: BuiltinRollupPluginConfigGetterMap[key] });
          if (typeof config[key] === 'object') Object.assign(builtinplugins[key], config[key]);
        }
      } else if (key === 'plugins') {
        plugins.push.apply(plugins, asArray(config.plugins ?? []) as RollupPlugin[]);
      } else if (key === 'output') {
        if (config.output && merged.output) Object.assign(merged.output, config.output);
        else merged.output = config.output as NonNullable<RollupConfig['output']>;
      } else {
        (merged as t.AnyRecord)[key] = config[key];
      }
    }
  }

  signale.debug(() => ['Resolved rollup builtin plugins configs:', json(builtinplugins)]);

  for (const key in builtinplugins) {
    if (isKey.call(builtinplugins, key) && builtinplugins[key] !== undefined) {
      plugins.unshift(BuiltinRollupPluginsMap[key](builtinplugins[key] as never));
    }
  }

  merged.plugins = plugins;

  return merged;
}
