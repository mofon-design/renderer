import { asArray } from '../../utils';
import { loadBabelConfig } from '../babel';
import { DefaultCoreSharedConfigMap } from '../core';
import type { ResolvedRollupConfig, RollupBabelConfig } from '../rollup';
import { loadRollupConfig } from '../rollup';
import type { UMDModuleConfig } from './interface';
import { DefaultUMDModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const BabelExtensionsIncludeTS = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
const NodeResolveExtensionsIncludeTS = BabelExtensionsIncludeTS.concat(['.json', '.node']);

export function loadUMDModuleConfig(
  config: t.Readonly<UMDModuleConfig> = {},
): ResolvedRollupConfig {
  const merged = DefaultUMDModuleConfig();

  for (const key in config) {
    if (!isKey.call(config, key)) continue;

    if (isKey.call(DefaultCoreSharedConfigMap, key)) {
      if (key !== 'babel') merged[key] = config[key];
    } else if (key === 'rollupBabel') {
      // ignore additional config
    } else {
      (merged.rollup as t.AnyRecord)[key] = config[key];
    }
  }

  if (config.rollupBabel === undefined || config.rollupBabel) {
    const babel = asArray(config.babel || []).concat();
    const typescript = babel.reduce((prev, curr) => {
      return curr.typescript === undefined ? prev : !!curr.typescript;
    }, false);

    babel.unshift({ env: { useBuiltIns: 'entry' } });
    merged.rollup.babel = loadBabelConfig(babel) as RollupBabelConfig;

    if (merged.rollup.babel.babelHelpers === undefined)
      merged.rollup.babel.babelHelpers = 'bundled';

    if (typeof config.rollupBabel === 'object')
      Object.assign(merged.rollup.babel, config.rollupBabel);

    if (typescript) {
      if (merged.rollup.babel.extensions === undefined)
        merged.rollup.babel.extensions = BabelExtensionsIncludeTS;
      if (merged.rollup.nodeResolve === undefined || merged.rollup.nodeResolve) {
        if (typeof merged.rollup.nodeResolve === 'object')
          merged.rollup.nodeResolve.extensions = NodeResolveExtensionsIncludeTS;
        else merged.rollup.nodeResolve = { extensions: NodeResolveExtensionsIncludeTS };
      }
    }
  } else {
    merged.rollup.babel = false;
  }

  const resolved = loadRollupConfig(merged.rollup);
  resolved.output.format = 'umd';

  return resolved;
}
