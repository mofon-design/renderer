import chalk from 'chalk';
import type { TaskFunction } from 'gulp';
import { parallel, series, task } from 'gulp';
import signale from 'signale';
import type { ResolvedWorkspaceConfig, WorkspaceConfig, WorkspacePackageInfo } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor } from '../utils';

export interface WorkspaceTask extends TaskFunction {
  (done: t.ArgsType<TaskFunction>[0], pkg: WorkspacePackageInfo): ReturnType<TaskFunction>;
}

export type WorkspaceTasks = WorkspaceTask | string | (WorkspaceTask | string)[];

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  tasks: WorkspaceTasks,
): TaskFunction {
  tasks = [tasks].flat(1);
  const combined =
    tasks.length === 1 ? (typeof tasks[0] === 'string' ? task(tasks[0]) : tasks[0]) : series(tasks);
  return createWorkspaceTask(loadWorkspaceConfig(config), combined);
}

function createWorkspaceTask(resolved: ResolvedWorkspaceConfig, task: WorkspaceTask): TaskFunction {
  if (Array.isArray(resolved)) {
    const combine = resolved[0] === 'series' ? series : parallel;
    return combine(resolved[1].map((item) => createWorkspaceTask(item, task)));
  }

  const workspaceTask = function workspaceTask(done: t.ArgsType<TaskFunction>[0]) {
    const { abspath, name } = resolved;
    process.chdir(abspath);
    const scopeName = chalk[allocateColor(name)].bold(name);
    signale.start(`${scopeName} (${abspath})`);
    return task(done, resolved);
  };

  workspaceTask.displayName = `workspace:${resolved.name}`;

  return workspaceTask;
}
