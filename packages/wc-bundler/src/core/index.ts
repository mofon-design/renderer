import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import type { CoreConfig } from '../config';
import { loadCoreConfig, loadListr2Config } from '../config';
import { asArray, json, signale } from '../utils';
import { cjs } from './cjs';
import { dts } from './dts';
import { esm } from './esm';
import { umd } from './umd';
import { workspace } from './wrokspace';

export function core(configs: t.Readonly<CoreConfig[]>): ListrTask<Listr2Ctx>['task'];
export function core(...configs: t.Readonly<CoreConfig>[]): ListrTask<Listr2Ctx>['task'];
export function core(): ListrTask<Listr2Ctx>['task'] {
  const configs: t.Readonly<CoreConfig[]> = Array.from(arguments).flat(1);

  const resolved = loadCoreConfig(configs);
  signale.debug(() => ['Resolved core config:', json(resolved)]);

  const coreTask: ListrTask<Listr2Ctx>['task'] = function coreTask(_ctx, self) {
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
    return core(configs)(ctx, self);
  };

  return workspace(resolved.workspace, createCoreTask, coreTask);
}

export async function bin(configs: t.Readonly<CoreConfig[]>): Promise<void>;
export async function bin(...configs: t.Readonly<CoreConfig>[]): Promise<void>;
export async function bin(): Promise<void> {
  const task = core.apply(null, arguments as never);
  await new Listr({ task }, loadListr2Config({})).run();
}
