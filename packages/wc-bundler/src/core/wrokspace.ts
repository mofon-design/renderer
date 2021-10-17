import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type t from 'types-lib';
import type { WorkspaceConfig } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor, loadPackageName } from '../utils';

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  final: ListrTask<Listr2Ctx>['task'],
  rootTask?: ListrTask<Listr2Ctx>['task'],
): ListrTask<Listr2Ctx>['task'] {
  return function createWorkspaceTask(ctx, self) {
    self.title = 'Detecting packages at current workspace...';
    const pkgs = loadWorkspaceConfig(config);

    if (!pkgs.length) {
      if (rootTask) {
        self.title = coloredWorkspaceTaskTitle();
        return rootTask(ctx, self);
      }

      return self.skip(`No package found at ${process.cwd()}`);
    }

    self.title = 'Running tasks for each package...';
    const tasks: ListrTask<Listr2Ctx>[] = pkgs.map(({ abspath, name }) => {
      return {
        title: coloredWorkspaceTaskTitle(abspath, name),
        task: function workspaceTask(ctx, self) {
          process.chdir(abspath);
          return final(ctx, self);
        },
      };
    });

    if (rootTask) {
      tasks.push({ task: rootTask, title: coloredWorkspaceTaskTitle() });
    }

    return self.newListr(tasks, { concurrent: false });
  };
}

export function coloredWorkspaceTaskTitle(
  cwd = process.cwd(),
  name = loadPackageName(cwd),
): string {
  return `${chalk[allocateColor(name)].bold(name)} (${cwd})`;
}
