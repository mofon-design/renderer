import type { TaskFunction } from 'gulp';
import type { ECMAScriptModuleConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): TaskFunction {
  return withIO(config, function esmTask(upstream) {
    const resolved = loadECMAScriptModuleConfig(config);
    return upstream.pipe(createBabelPipeline(resolved.babel ?? {}, { env: { modules: 'auto' } }));
  });
}
