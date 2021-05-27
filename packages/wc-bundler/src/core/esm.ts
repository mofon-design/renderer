import type { ListrTask } from 'listr2';
import type { ECMAScriptModuleConfig } from '../config';
import { loadBabelConfig } from '../config';
import { loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, function esmTask(upstream, self, resolved) {
    self.title = 'Transform to ECMAScript module';
    const babelConfigs = asArray(resolved.babel || []).concat({ env: { modules: false } });
    const resolvedBabelConfig = loadBabelConfig(babelConfigs);
    return upstream.pipe(createBabelPipeline(resolvedBabelConfig));
  });

  function loadConfig() {
    const resolved = loadECMAScriptModuleConfig(config);
    signale.debug(() => ['Resolved esm config:', json(resolved)]);
    return resolved;
  }
}
