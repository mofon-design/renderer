import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import signale from 'signale';
import type { CoreConfig } from '../config';
import { loadCoreConfig, loadListr2Config } from '../config';
import { env } from '../utils';
import { cjs } from './cjs';
import { esm } from './esm';
import { umd } from './umd';
import { workspace } from './wrokspace';

export function core(configs: t.Readonly<CoreConfig[]>): ListrTask<Listr2Ctx>;
export function core(...configs: t.Readonly<CoreConfig>[]): ListrTask<Listr2Ctx>;
export function core(): ListrTask<Listr2Ctx> {
  const configs = Array.from(arguments) as t.Readonly<CoreConfig>[];

  return {
    task(_ctx, task) {
      const tasks = createCoreTasks(configs);
      if (!tasks.length) return signale.info(`No task found`);
      return task.newListr(tasks, { concurrent: true });
    },
  };
}

export function createCoreTasks(configs: t.Readonly<CoreConfig[]>): ListrTask<Listr2Ctx>[];
export function createCoreTasks(...configs: t.Readonly<CoreConfig>[]): ListrTask<Listr2Ctx>[];
export function createCoreTasks(): ListrTask<Listr2Ctx>[] {
  const resolved = loadCoreConfig.apply(null, arguments as never);

  if (env.DEBUG) signale.debug('Resolved core config: ', resolved);

  if (resolved.workspace)
    return workspace(resolved.workspace, core(resolved, { workspace: false }));

  const tasks: ListrTask<Listr2Ctx>[] = [];

  if (resolved.cjs) tasks.push(cjs(resolved.cjs));
  if (resolved.esm) tasks.push(esm(resolved.esm));
  if (resolved.umd) tasks.push(umd(resolved.umd));

  return tasks;
}

export async function bin(configs: t.Readonly<CoreConfig[]>): Promise<void>;
export async function bin(...configs: t.Readonly<CoreConfig>[]): Promise<void>;
export async function bin(): Promise<void> {
  const tasks = createCoreTasks.apply(null, arguments as never);
  if (!tasks.length) return signale.info(`No task found`);
  await new Listr(tasks, loadListr2Config({})).run();
}
