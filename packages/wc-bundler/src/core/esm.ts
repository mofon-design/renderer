import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { Settings as GulpTypeScriptSettings } from 'gulp-typescript';
import gulpts from 'gulp-typescript';
import merge from 'merge2';
import type { Readable } from 'stream';
import type { ECMAScriptModuleConfig } from '../config';
import {
  loadBabelConfig,
  loadECMAScriptModuleConfig,
  loadTypeScriptCompileConfig,
} from '../config';
import {
  createBabelPipeline,
  createCopyPipeline,
  createExtnamePipeline,
  filterByExtname,
} from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function esm(config?: t.Readonly<ECMAScriptModuleConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function esmTask(self, resolved, hook) {
    await hook.prepare();
    const upstream = hook.before(src(resolved.entry));
    const override: GulpTypeScriptSettings = {
      declaration: true,
      jsx: 'preserve',
      module: 'esnext',
      target: 'esnext',
    };

    const tsc = loadTypeScriptCompileConfig(asArray(resolved.tsc ?? []));
    const babel = loadBabelConfig(
      asArray(resolved.babel ?? []).concat({ env: { modules: false } }),
    );
    signale.debug(() => ['Resolved tsc config:', json(tsc)]);
    signale.debug(() => ['Resolved babel config:', json(babel)]);

    self.title = 'Transform to ECMAScript module';

    const output: Readable[] = [];

    output.push(upstream.pipe(filterByExtname(resolved.exts.copy)).pipe(createCopyPipeline()));

    output.push(
      upstream
        .pipe(filterByExtname(resolved.exts.babel))
        .pipe(createBabelPipeline(babel))
        .pipe(createExtnamePipeline(resolved.outext)),
    );

    if (tsc) {
      const tscOutput = upstream
        .pipe(filterByExtname(resolved.exts.tsc))
        .pipe(gulpts(Object.assign({}, tsc.loaded, override)));

      if (!tsc.parsed.options.noEmit) {
        output.push(
          tscOutput.js
            .pipe(createBabelPipeline(babel))
            .pipe(createExtnamePipeline(resolved.outext)),
        );

        if (tsc.parsed.options.declaration) {
          output.push(tscOutput.dts);
        }
      }
    }

    return hook.after(merge(output));
  });

  function loadConfig() {
    const resolved = loadECMAScriptModuleConfig(config);
    signale.debug(() => ['Resolved esm config:', json(resolved)]);
    return resolved;
  }
}
