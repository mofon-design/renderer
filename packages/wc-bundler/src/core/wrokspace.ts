import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { WorkspaceConfig } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor, asArray, loadPackageName } from '../utils';

export interface WorkspaceExtraTasks
  extends Partial<
    Record<'afterAll' | 'beforeAll', ListrTask<Listr2Ctx> | readonly ListrTask<Listr2Ctx>[]>
  > {}

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  final: ListrTask<Listr2Ctx>['task'],
  extraTasks: WorkspaceExtraTasks = {},
): ListrTask<Listr2Ctx>['task'] {
  return function createWorkspaceTask(_ctx, self) {
    self.title = 'Detecting packages at current workspace...';
    const resolved = loadWorkspaceConfig(config);
    if (!resolved.length) return self.skip(`No package found at ${process.cwd()}`);

    self.title = 'Running tasks for each package...';
    let tasks: ListrTask<Listr2Ctx>[] = resolved.map(({ abspath, name }) => {
      return {
        title: coloredWorkspaceTaskTitle(abspath, name),
        task: function workspaceTask(ctx, self) {
          process.chdir(abspath);
          return final(ctx, self);
        },
      };
    });

    if (extraTasks.afterAll) tasks = tasks.concat(extraTasks.afterAll);
    if (extraTasks.beforeAll) tasks = asArray(extraTasks.beforeAll).concat(tasks);

    return self.newListr(tasks, { concurrent: false });
  };
}

export function coloredWorkspaceTaskTitle(
  cwd = process.cwd(),
  name = loadPackageName(cwd),
): string {
  return `${chalk[allocateColor(name)].bold(name)} (${cwd})`;
}
