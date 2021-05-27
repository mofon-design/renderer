import { asArray, loadPackageJSON } from '../../utils';
import { loadBabelConfig } from '../babel';
import { DefaultCoreSharedConfigGetterMap } from '../core';
import type { ResolvedRollupConfig, RollupBabelConfig } from '../rollup';
import { loadRollupConfig } from '../rollup';
import type { ResolvedUMDModuleConfig, UMDModuleConfig } from './interface';
import { DefaultUMDModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const Defaults = {
  get BabelExtensionsIncludeTS() {
    return ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
  },
  get NodeResolveExtensionsIncludeTS() {
    return Defaults.BabelExtensionsIncludeTS.concat(['.json', '.node']);
  },
};

export function loadUMDModuleConfig(
  config: t.Readonly<UMDModuleConfig> = {},
): ResolvedRollupConfig {
  const merged = DefaultUMDModuleConfig();

  for (const key in config) {
    if (!isKey.call(config, key)) continue;

    if (isKey.call(DefaultCoreSharedConfigGetterMap, key)) {
      if (key !== 'babel') merged[key] = config[key] as ResolvedUMDModuleConfig[typeof key];
    } else if (key === 'rollupBabel') {
      // ignore additional config
    } else {
      (merged.rollup as t.AnyRecord)[key] = config[key];
    }
  }

  if (config.rollupBabel === undefined || config.rollupBabel) {
    const babel = asArray(config.babel || []).concat();
    const extra = {
      ...(typeof config.rollupBabel === 'object' ? config.rollupBabel : null),
    };

    if (!extra.babelHelpers) extra.babelHelpers = 'bundled';
    if (extra.babelHelpers !== 'external') babel.push({ 'plugin-transform-runtime': false });
    try {
      const corejs = loadPackageJSON(require.resolve('core-js'))?.version;
      babel.unshift({
        env: { corejs: typeof corejs === 'string' ? corejs : undefined, useBuiltIns: 'entry' },
      });
    } catch {}

    const babelRawConfig = loadBabelConfig.raw(babel);
    merged.rollup.babel = Object.assign(
      loadBabelConfig.fromRaw(babelRawConfig) as RollupBabelConfig,
      extra,
    );

    if (babelRawConfig.typescript) {
      if (merged.rollup.babel.extensions === undefined)
        merged.rollup.babel.extensions = Defaults.BabelExtensionsIncludeTS;
      if (merged.rollup.nodeResolve === undefined || merged.rollup.nodeResolve) {
        if (typeof merged.rollup.nodeResolve === 'object')
          merged.rollup.nodeResolve.extensions = Defaults.NodeResolveExtensionsIncludeTS;
        else merged.rollup.nodeResolve = { extensions: Defaults.NodeResolveExtensionsIncludeTS };
      }
    }
  } else {
    merged.rollup.babel = false;
  }

  const resolved = loadRollupConfig(merged.rollup);
  resolved.output.format = 'umd';

  return resolved;
}
