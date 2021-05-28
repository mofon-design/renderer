import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { ECMAScriptModuleConfig } from '../config';
import { loadBabelConfig, loadECMAScriptModuleConfig } from '../config';
import { createBabelPipeline, createExtnamePipeline } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function esmTask(self, resolved, hook) {
    await hook.prepare();
    const upstream = hook.before(src(resolved.entry));

    self.title = 'Transform to ECMAScript module';
    const babel = loadBabelConfig(
      asArray(resolved.babel || []).concat({ env: { modules: false } }),
    );
    signale.debug(() => ['Resolved babel config:', json(babel)]);

    const downstream = upstream
      .pipe(createBabelPipeline(babel))
      .pipe(createExtnamePipeline(resolved.extname));
    return hook.after(downstream);
  });

  function loadConfig() {
    const resolved = loadECMAScriptModuleConfig(config);
    signale.debug(() => ['Resolved esm config:', json(resolved)]);
    return resolved;
  }
}
