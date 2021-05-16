import type { ListrTask } from 'listr2';
import type { CommonJSModuleConfig } from '../config';
import { loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray, signale } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, function cjsTask(upstream, self, resolved) {
    self.title = 'Transform to CommonJS module';
    const babelConfigs = asArray(resolved.babel || []).concat({ env: { modules: 'cjs' } });
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });

  function loadConfig() {
    const resolved = loadCommonJSModuleConfig(config);
    signale.json.debug('Resolved cjs config:', resolved);
    return resolved;
  }
}
