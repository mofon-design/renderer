import type { RollupOptions } from 'rollup';
import { asArray } from '../../utils';
import { loadBabelConfig } from '../babel';
import { DefaultCoreSharedConfigMap } from '../core';
import type { RollupBabelConfig } from '../rollup';
import { loadRollupConfig } from '../rollup';
import type { UMDModuleConfig } from './interface';
import { DefaultUMDModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const BabelExtensionsWithTypeScriptFiles = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
const NodeResolveExtensionsWithTypeScriptFiles = ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'];

export function loadUMDModuleConfig(config: t.Readonly<UMDModuleConfig> = {}): RollupOptions {
  const merged = DefaultUMDModuleConfig();

  for (const key in config) {
    if (!isKey.call(config, key)) continue;

    if (isKey.call(DefaultCoreSharedConfigMap, key)) {
      if (key !== 'babel') merged[key] = config[key];
    } else if (key === 'rollupBabel') {
      // ignore additional config
    } else if (key === 'output') {
      if (config.output && merged.rollup.output) {
        Object.assign(merged.rollup.output, config.output);
      } else {
        merged.rollup.output = config.output as UMDModuleConfig['output'];
      }
    } else {
      (merged.rollup as t.UnknownRecord)[key] = config[key];
    }
  }

  if (config.rollupBabel === undefined || config.rollupBabel) {
    const babel = asArray(config.babel || []);
    const typescript = babel.reduce((prev, curr) => {
      return curr.typescript === undefined ? prev : !!curr.typescript;
    }, false);

    merged.rollup.babel = loadBabelConfig(babel) as RollupBabelConfig;

    if (typeof config.rollupBabel === 'object')
      Object.assign(merged.rollup.babel, config.rollupBabel);

    if (typescript) {
      if (merged.rollup.babel.extensions === undefined)
        merged.rollup.babel.extensions = BabelExtensionsWithTypeScriptFiles;
      if (merged.rollup.nodeResolve === undefined || merged.rollup.nodeResolve) {
        if (typeof merged.rollup.nodeResolve === 'object')
          merged.rollup.nodeResolve.extensions = NodeResolveExtensionsWithTypeScriptFiles;
        else merged.rollup.nodeResolve = { extensions: NodeResolveExtensionsWithTypeScriptFiles };
      }
    }
  } else {
    merged.rollup.babel = false;
  }

  return loadRollupConfig(merged.rollup);
}
