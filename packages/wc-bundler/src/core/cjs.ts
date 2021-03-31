import type { TaskFunction } from 'gulp';
import * as signale from 'signale';
import type { CommonJSModuleConfig } from '../config';
import { loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): TaskFunction {
  return withIO(config, function cjs(upstream) {
    const resolved = loadCommonJSModuleConfig(config);
    const babelConfigs = resolved.babel ? asArray(resolved.babel) : [];
    babelConfigs.push({ env: { modules: 'cjs' } });
    signale.start('Transform to CommonJS module');
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });
}
