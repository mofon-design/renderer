import type { ListrTask } from 'listr2';
import type { ECMAScriptModuleConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(config, function esmTask(upstream, task) {
    task.title = 'Transform to ECMAScript module';
    const resolved = loadECMAScriptModuleConfig(config);
    const babelConfigs = resolved.babel ? asArray(resolved.babel) : [];
    babelConfigs.push({ env: { modules: false } });
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });
}
