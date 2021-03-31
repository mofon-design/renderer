import type { TaskFunction } from 'gulp';
import type { CommonJSModuleConfig } from '../config';
import { loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): TaskFunction {
  return withIO(config, function cjsTask(upstream) {
    const resolved = loadCommonJSModuleConfig(config);
    return upstream.pipe(createBabelPipeline(resolved.babel ?? {}, { env: { modules: 'cjs' } }));
  });
}
