import type { ListrTask } from 'listr2';
import type { ECMAScriptModuleConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  const task = withIO(config, function esmTask(upstream) {
    const resolved = loadECMAScriptModuleConfig(config);
    const babelConfigs = resolved.babel ? asArray(resolved.babel) : [];
    babelConfigs.push({ env: { modules: false } });
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });

  return { task, title: 'Transform to ECMAScript module' };
}
