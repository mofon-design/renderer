import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { CommonJSModuleConfig } from '../config';
import { loadBabelConfig, loadCommonJSModuleConfig } from '../config';
import { createBabelPipeline, createExtnamePipeline } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function cjsTask(self, resolved, hook) {
    await hook.prepare();
    const upstream = hook.before(src(resolved.entry));

    self.title = 'Transform to CommonJS module';
    const babel = loadBabelConfig(
      asArray(resolved.babel || []).concat({ env: { modules: 'cjs' } }),
    );
    signale.debug(() => ['Resolved babel config:', json(babel)]);

    const downstream = upstream
      .pipe(createBabelPipeline(babel))
      .pipe(createExtnamePipeline(resolved.extname));
    return hook.after(downstream);
  });

  function loadConfig() {
    const resolved = loadCommonJSModuleConfig(config);
    signale.debug(() => ['Resolved cjs config:', json(resolved)]);
    return resolved;
  }
}
