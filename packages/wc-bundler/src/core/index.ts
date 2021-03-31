import type { TaskFunction } from 'gulp';
import { parallel } from 'gulp';
import * as signale from 'signale';
import type { CoreConfig } from '../config';
import { loadCoreConfig } from '../config';
import { env } from '../utils';
import { cjs } from './cjs';
import { esm } from './esm';
import { workspace } from './wrokspace';

export function core(config: t.Readonly<CoreConfig> = {}): TaskFunction {
  return function coreTask() {
    const resolved = loadCoreConfig(config);
    if (env.DEBUG) signale.debug('Resolved core config: ', resolved);
    const tasks: TaskFunction[] = [];

    if (resolved.cjs) tasks.push(cjs(resolved.cjs));
    if (resolved.esm) tasks.push(esm(resolved.esm));

    if (resolved.workspace) {
      return workspace(resolved.workspace, tasks).apply(null, arguments as never);
    }

    return parallel(tasks).apply(null, arguments as never);
  };
}
