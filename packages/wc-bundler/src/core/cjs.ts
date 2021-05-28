import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { Settings as GulpTypeScriptSettings } from 'gulp-typescript';
import gulpts from 'gulp-typescript';
import merge from 'merge2';
import type { Readable } from 'stream';
import type { CommonJSModuleConfig } from '../config';
import { loadBabelConfig, loadCommonJSModuleConfig, loadTypeScriptCompileConfig } from '../config';
import { createBabelPipeline, createExtnamePipeline, filterByExtname } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function cjs(config?: t.Readonly<CommonJSModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function cjsTask(self, resolved, hook) {
    await hook.prepare();
    const upstream = hook.before(src(resolved.entry));
    const override: GulpTypeScriptSettings = {
      declaration: true,
      jsx: 'preserve',
      module: 'esnext',
      rootDir: process.cwd(),
      target: 'esnext',
    };

    const tsc = loadTypeScriptCompileConfig(asArray(resolved.tsc || []));
    const babel = loadBabelConfig(
      asArray(resolved.babel || []).concat({ env: { modules: 'cjs' } }),
    );
    signale.debug(() => ['Resolved tsc config:', json(tsc)]);
    signale.debug(() => ['Resolved babel config:', json(babel)]);

    self.title = 'Transform to CommonJS module';

    const output: Readable[] = [];

    output.push(
      upstream
        .pipe(filterByExtname(resolved.exts.babel))
        .pipe(createBabelPipeline(babel))
        .pipe(createExtnamePipeline(resolved.outext)),
    );

    if (tsc) {
      const tscOutput = upstream
        .pipe(filterByExtname(resolved.exts.tsc))
        .pipe(gulpts(Object.assign(override, tsc.loaded)));

      output.push(
        tscOutput.js.pipe(createBabelPipeline(babel)).pipe(createExtnamePipeline(resolved.outext)),
        tscOutput.dts,
      );
    }

    return hook.after(merge(output));
  });

  function loadConfig() {
    const resolved = loadCommonJSModuleConfig(config);
    signale.debug(() => ['Resolved cjs config:', json(resolved)]);
    return resolved;
  }
}
