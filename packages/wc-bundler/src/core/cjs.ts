import type { ListrTask } from 'listr2';
import type { CommonJSModuleConfig } from '../config';
import { loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): ListrTask<Listr2Ctx> {
  const task = withIO(config, function cjsTask(upstream) {
    const resolved = loadCommonJSModuleConfig(config);
    const babelConfigs = resolved.babel ? asArray(resolved.babel) : [];
    babelConfigs.push({ env: { modules: 'cjs' } });
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });

  return { task, title: 'Transform to CommonJS module' };
}
