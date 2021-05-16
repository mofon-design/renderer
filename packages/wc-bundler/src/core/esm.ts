import type { ListrTask } from 'listr2';
import type { ECMAScriptModuleConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray, signale } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, function esmTask(upstream, self, resolved) {
    self.title = 'Transform to ECMAScript module';
    const babelConfigs = asArray(resolved.babel || []).concat({ env: { modules: false } });
    return upstream.pipe(createBabelPipeline(babelConfigs));
  });

  function loadConfig() {
    const resolved = loadECMAScriptModuleConfig(config);
    signale.json.debug('Resolved esm config:', resolved);
    return resolved;
  }
}
