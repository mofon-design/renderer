import type { RollupOptions } from 'rollup';
import { asArray } from '../../utils';
import { loadBabelConfig } from '../babel';
import { DefaultCoreSharedConfigMap } from '../core';
import type { RollupBabelConfig } from '../rollup';
import { loadRollupConfig } from '../rollup';
import type { UMDModuleConfig } from './interface';
import { DefaultUMDModuleConfig } from './interface';

const isKey = Object.prototype.hasOwnProperty as t.Object.prototype.hasOwnProperty;

const ExtensionsWithTypeScriptFiles = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];

export function loadUMDModuleConfig(
  config: t.Readonly<UMDModuleConfig> | undefined,
): RollupOptions {
  const merged = DefaultUMDModuleConfig();

  if (config) {
    for (const key in config) {
      if (!isKey.call(config, key)) continue;

      if (isKey.call(DefaultCoreSharedConfigMap, key)) {
        if (key !== 'babel') merged[key] = config[key];
      } else if (key === 'rollupBabel') {
        if (config[key] === undefined || config[key]) {
          const babel = asArray(config.babel || []);
          const typescript = babel.reduce((prev, curr) => {
            return curr.typescript === undefined ? prev : !!curr.typescript;
          }, false);

          merged.rollup.babel = loadBabelConfig(babel) as RollupBabelConfig;
          if (typescript) merged.rollup.babel.extensions = ExtensionsWithTypeScriptFiles;
          if (typeof config[key] === 'object') Object.assign(merged.rollup.babel, config[key]);
        } else {
          merged.rollup.babel = false;
        }
      } else {
        (merged.rollup as t.UnknownRecord)[key] = config[key];
      }
    }
  }

  return loadRollupConfig(merged.rollup);
}
