import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { Settings as GulpTypeScriptSettings } from 'gulp-typescript';
import gulpts from 'gulp-typescript';
import merge from 'merge2';
import type t from 'types-lib';
import type { TypeScriptDeclarationConfig } from '../config';
import { loadTypeScriptCompileConfig, loadTypeScriptDeclarationConfig } from '../config';
import { createCopyPipeline, filterByExtname } from '../pipelines';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function dts(config?: t.Readonly<TypeScriptDeclarationConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function dtsTask(self, resolved, hook) {
    await hook.prepare();

    const upstream = hook.before(src(asArray(resolved.entry), { allowEmpty: true }));
    const override: GulpTypeScriptSettings = {
      declaration: true,
      jsx: 'preserve',
      module: 'esnext',
      target: 'esnext',
    };

    const tsc = loadTypeScriptCompileConfig(asArray(resolved.tsc ?? []));
    signale.debug(() => ['Resolved tsc config:', json(tsc)]);

    if (!tsc?.parsed.options.declaration || tsc.parsed.options.noEmit)
      return self.skip('TypeScript declaration disabled');

    self.title = 'Generate TypeScript declaration';

    return hook.after(
      merge([
        upstream.pipe(filterByExtname(resolved.exts.copy)).pipe(createCopyPipeline()),
        upstream
          .pipe(filterByExtname(resolved.exts.tsc))
          .pipe(gulpts(Object.assign({}, tsc.loaded, override))).dts,
      ]),
    );
  });

  function loadConfig() {
    const resolved = loadTypeScriptDeclarationConfig(config);
    signale.debug(() => ['Resolved dts config:', json(resolved)]);
    return resolved;
  }
}
