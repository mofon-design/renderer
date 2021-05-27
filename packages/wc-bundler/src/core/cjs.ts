import type { ListrTask } from 'listr2';
import type { CommonJSModuleConfig } from '../config';
import { loadBabelConfig } from '../config';
import { loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, function cjsTask(upstream, self, resolved) {
    self.title = 'Transform to CommonJS module';
    const babelConfigs = asArray(resolved.babel || []).concat({ env: { modules: 'cjs' } });
    const resolvedBabelConfig = loadBabelConfig(babelConfigs);
    return upstream.pipe(createBabelPipeline(resolvedBabelConfig));
  });

  function loadConfig() {
    const resolved = loadCommonJSModuleConfig(config);
    signale.debug(() => ['Resolved cjs config:', json(resolved)]);
    return resolved;
  }
}
