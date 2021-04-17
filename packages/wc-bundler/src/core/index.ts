import type { TaskFunction } from 'gulp';
import { parallel } from 'gulp';
import signale from 'signale';
import type { CoreConfig } from '../config';
import { loadCoreConfig } from '../config';
import { env } from '../utils';
import { cjs } from './cjs';
import { esm } from './esm';
import { umd } from './umd';
import { workspace } from './wrokspace';

export function core(configs: t.Readonly<CoreConfig[]>): TaskFunction;
export function core(...configs: t.Readonly<CoreConfig>[]): TaskFunction;
export function core(): TaskFunction {
  const configs = Array.from(arguments) as t.Readonly<CoreConfig>[];

  return function coreTask(done): ReturnType<TaskFunction> {
    const resolved = loadCoreConfig.apply(null, configs);
    if (env.DEBUG) signale.debug('Resolved core config: ', resolved);

    if (resolved.workspace) {
      const task = core(resolved, { workspace: false });
      return workspace(resolved.workspace, task).apply(null, arguments as never);
    }

    const tasks: TaskFunction[] = [];

    if (resolved.cjs) tasks.push(cjs(resolved.cjs));
    if (resolved.esm) tasks.push(esm(resolved.esm));
    if (resolved.umd) tasks.push(umd(resolved.umd));

    if (!tasks.length) {
      signale.info(`No task found in ${process.cwd()}`);
      return done();
    }

    return parallel(tasks).apply(null, arguments as never);
  };
}
