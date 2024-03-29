import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import { join } from 'path';
import type t from 'types-lib';
import YargsParser from 'yargs-parser';
import { CoreConfig, loadCoreConfigFiles } from '../config';
import { loadCoreConfig, loadListr2Config } from '../config';
import { asArray, json, signale } from '../utils';
import { cjs } from './cjs';
import { dts } from './dts';
import { esm } from './esm';
import { umd } from './umd';
import { workspace } from './wrokspace';

export function core(
  overrideConfigs?: t.Readonly<CoreConfig> | t.Readonly<CoreConfig[]>,
  configFile?: boolean | string[],
  extendConfigs?: t.Readonly<CoreConfig> | t.Readonly<CoreConfig[]>,
): ListrTask<Listr2Ctx>['task'] {
  const cwd = process.cwd();
  const configsFromFile = loadCoreConfigFiles(configFile);
  signale.debug(() => ['Loaded core config from file:', json(configsFromFile)]);

  const configs = asArray(extendConfigs ?? []).concat(configsFromFile);
  const resolved = loadCoreConfig(configs.concat(overrideConfigs ?? []));
  signale.debug(() => ['Resolved core config:', json(resolved)]);

  const coreTask: ListrTask<Listr2Ctx>['task'] = function coreTask(_ctx, self) {
    process.chdir(cwd);

    let tasks: ListrTask<Listr2Ctx>[] = [];

    if (resolved.dts)
      tasks = tasks.concat(asArray(resolved.dts).map((taskConfig) => dts(taskConfig)));
    if (resolved.cjs)
      tasks = tasks.concat(asArray(resolved.cjs).map((taskConfig) => cjs(taskConfig)));
    if (resolved.esm)
      tasks = tasks.concat(asArray(resolved.esm).map((taskConfig) => esm(taskConfig)));
    if (resolved.umd)
      tasks = tasks.concat(asArray(resolved.umd).map((taskConfig) => umd(taskConfig)));

    if (!tasks.length) return self.skip();

    return self.newListr(tasks, { concurrent: false });
  };

  if (!resolved.workspace) {
    return coreTask;
  }

  const createCoreTask: ListrTask<Listr2Ctx>['task'] = function createCoreTask(ctx, self) {
    return core(overrideConfigs, !!configFile, configs)(ctx, self);
  };

  return workspace(
    resolved.workspace,
    createCoreTask,
    resolved.workspace.skipRootTasks ? undefined : coreTask,
  );
}

export async function bin(
  configs?: t.Readonly<CoreConfig> | t.Readonly<CoreConfig[]>,
  configFile = true,
): Promise<void> {
  const configFromCLI = Object.assign(YargsParser(process.argv.slice(2)), {
    __configSourcePath: join(process.cwd(), '<cli>'),
  });

  signale.debug(() => ['Parsed config from CLI:', json(configFromCLI)]);

  const configFilesFromCLI = configFile && configFromCLI._.length ? configFromCLI._ : configFile;
  const task = core(asArray(configs ?? []).concat(configFromCLI), configFilesFromCLI);
  await new Listr({ task }, loadListr2Config({})).run();
}
