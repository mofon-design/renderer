import type { TaskFunction } from 'gulp';
import { parallel } from 'gulp';
import * as signale from 'signale';
import type { CoreConfig } from '../config';
import { loadCoreConfig } from '../config';
import { env } from '../utils';
import { cjs } from './cjs';
import { esm } from './esm';
import { umd } from './umd';
import { workspace } from './wrokspace';

export function core(config: t.Readonly<CoreConfig> = {}): TaskFunction {
  return function coreTask(done): ReturnType<TaskFunction> {
    if (config.workspace === undefined || config.workspace) {
      const task = core({ ...config, workspace: false });
      const workspaceConfig =
        typeof config.workspace === 'object' && config.workspace ? config.workspace : undefined;

      return workspace(workspaceConfig, task).apply(null, arguments as never);
    }

    const resolved = loadCoreConfig(config);
    if (env.DEBUG) signale.debug('Resolved core config: ', resolved);
    const tasks: TaskFunction[] = [];

    if (resolved.cjs) tasks.push(cjs(resolved.cjs));
    if (resolved.esm) tasks.push(esm(resolved.esm));
    if (resolved.umd) tasks.push(umd(resolved.umd));

    if (!tasks.length) {
      signale.info(`Non task found in ${process.cwd()}`);
      return done();
    }

    return parallel(tasks).apply(null, arguments as never);
  };
}
