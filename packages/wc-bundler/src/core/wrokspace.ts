import { loadWorkspaceConfig, WorkspaceConfig } from '../config';
import * as chalk from 'chalk';
import { TaskFunction, series } from 'gulp';
import * as signale from 'signale';
import { allocateColor } from '../utils';

export interface WorkspaceTask extends TaskFunction {
  (done: t.ArgsType<TaskFunction>[0], pkgname: string): ReturnType<TaskFunction>;
}

export function workspace(config: WorkspaceConfig, task: WorkspaceTask): TaskFunction {
  return series(loadWorkspaceConfig(config).map((pkg) => createWorkspaceTask(pkg, task)));
}

function createWorkspaceTask(pkg: { abspath: string; name: string }, task: WorkspaceTask) {
  return function workspaceTask(done: t.ArgsType<TaskFunction>[0]) {
    process.chdir(pkg.abspath);
    signale.start(`${chalk[allocateColor(pkg.name)].bold(pkg.name)} (${pkg.abspath})`);
    return task(done, pkg.name);
  };
}
