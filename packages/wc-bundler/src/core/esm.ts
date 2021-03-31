import type { TaskFunction } from 'gulp';
import * as signale from 'signale';
import type { ECMAScriptModuleConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): TaskFunction {
  return withIO(config, function esm(upstream) {
    const resolved = loadECMAScriptModuleConfig(config);
    const babelConfigs = resolved.babel ? asArray(resolved.babel) : [];
    babelConfigs.push({ env: { modules: 'auto' } });
    signale.start('Transform to ECMAScript module');
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });
}
