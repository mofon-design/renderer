import { src } from 'gulp';
import type { ListrTask } from 'listr2';
import gulpts from 'gulp-typescript';
import type { Settings as GulpTypeScriptSettings } from 'gulp-typescript';
import type { CompilerOptions } from 'typescript';
import type { TypeScriptDeclarationConfig } from '../config';
import { loadTypeScriptCompileConfig, loadTypeScriptDeclarationConfig } from '../config';
import { asArray, json, signale } from '../utils';
import { withIO } from './io';

export function dts(config?: t.Readonly<TypeScriptDeclarationConfig>): ListrTask<Listr2Ctx> {
  return withIO(loadConfig, async function dtsTask(self, resolved, hook) {
    await hook.prepare();

    const tsc = loadTypeScriptCompileConfig(asArray(resolved.tsc || []));
    signale.debug(() => ['Resolved tsc config:', json(tsc)]);
    if (!tsc) return self.skip('TypeScript declaration disabled');

    const entry = tsc.fileNames?.length ? tsc.fileNames : resolved.entry;
    const stream = hook.before(src(asArray(entry).concat(['!**/*.d.ts']), { allowEmpty: true }));

    self.title = 'Generate TypeScript declaration';
    const pipeline = gulpts(transformCompilerConfig(tsc.rawCompilerOptions));
    return hook.after(stream.pipe(pipeline).dts as NodeJS.ReadStream);
  });

  function loadConfig() {
    const resolved = loadTypeScriptDeclarationConfig(config);
    signale.debug(() => ['Resolved dts config:', json(resolved)]);
    return resolved;
  }
}

function transformCompilerConfig(options: CompilerOptions): GulpTypeScriptSettings {
  options.declaration = true;
  delete options.emitDeclarationOnly;
  delete options.noEmit;

  const settings = options as GulpTypeScriptSettings;
  settings.target = 'esnext';
  settings.module = 'esnext';
  return settings;
}
