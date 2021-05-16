import type { ListrTask } from 'listr2';
import { Listr } from 'listr2';
import type { CoreConfig } from '../config';
import { loadCoreConfig, loadListr2Config } from '../config';
import { signale } from '../utils';
import { cjs } from './cjs';
import { esm } from './esm';
import { umd } from './umd';
import { coloredWorkspaceTaskTitle, workspace } from './wrokspace';

export function core(configs: t.Readonly<CoreConfig[]>): ListrTask<Listr2Ctx>['task'];
export function core(...configs: t.Readonly<CoreConfig>[]): ListrTask<Listr2Ctx>['task'];
export function core(): ListrTask<Listr2Ctx>['task'] {
  const resolved = loadCoreConfig.apply(null, arguments as never);
  signale.debug('Resolved core config: ', resolved);

  const coreTask: ListrTask<Listr2Ctx>['task'] = function coreTask(_ctx, self) {
    const tasks: ListrTask<Listr2Ctx>[] = [];

    if (resolved.cjs) tasks.push(cjs(resolved.cjs));
    if (resolved.esm) tasks.push(esm(resolved.esm));
    if (resolved.umd) tasks.push(umd(resolved.umd));

    if (!tasks.length) return self.skip();

    return self.newListr(tasks, { concurrent: true });
  };

  if (!resolved.workspace) {
    return coreTask;
  }

  const coreTaskTitle = coloredWorkspaceTaskTitle();
  const afterAll: ListrTask<Listr2Ctx> = { title: coreTaskTitle, task: coreTask };
  const createCoreTask: ListrTask<Listr2Ctx>['task'] = function createCoreTask(ctx, self) {
    return core(resolved, { workspace: false })(ctx, self);
  };

  return workspace(resolved.workspace, createCoreTask, { afterAll });
}

export async function bin(configs: t.Readonly<CoreConfig[]>): Promise<void>;
export async function bin(...configs: t.Readonly<CoreConfig>[]): Promise<void>;
export async function bin(): Promise<void> {
  const task = core.apply(null, arguments as never);
  await new Listr({ task }, loadListr2Config({})).run();
}
