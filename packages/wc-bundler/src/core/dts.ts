import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { Settings as GulpTypeScriptSettings } from 'gulp-typescript';
import gulpts from 'gulp-typescript';
import type { TypeScriptDeclarationConfig } from '../config';
import { loadTypeScriptCompileConfig, loadTypeScriptDeclarationConfig } from '../config';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function dts(config?: t.Readonly<TypeScriptDeclarationConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function dtsTask(self, resolved, hook) {
    await hook.prepare();

    const upstream = hook.before(
      src(asArray(resolved.entry).concat(['!**/*.d.ts']), { allowEmpty: true }),
    );
    const override: GulpTypeScriptSettings = {
      declaration: true,
      jsx: 'preserve',
      module: 'esnext',
      rootDir: process.cwd(),
      target: 'esnext',
    };

    const tsc = loadTypeScriptCompileConfig(asArray(resolved.tsc ?? []));
    signale.debug(() => ['Resolved tsc config:', json(tsc)]);

    if (!tsc) return self.skip('TypeScript declaration disabled');

    self.title = 'Generate TypeScript declaration';
    const downstream = upstream.pipe(gulpts(Object.assign(override, tsc.loaded))).dts;

    return hook.after(downstream);
  });

  function loadConfig() {
    const resolved = loadTypeScriptDeclarationConfig(config);
    signale.debug(() => ['Resolved dts config:', json(resolved)]);
    return resolved;
  }
}
