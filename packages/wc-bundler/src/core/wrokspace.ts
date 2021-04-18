import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { WorkspaceConfig } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor } from '../utils';

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  final: ListrTask<Listr2Ctx>['task'],
): ListrTask<Listr2Ctx>['task'] {
  return function createWorkspaceTask(_ctx, self) {
    self.title = 'Detecting packages at current workspace...';
    const resolved = loadWorkspaceConfig(config);
    if (!resolved.length) return self.skip(`No package found at ${process.cwd()}`);

    self.title = 'Running tasks for each package...';
    const tasks: ListrTask<Listr2Ctx>[] = resolved.map(({ abspath, name }) => {
      return {
        title: `${chalk[allocateColor(name)].bold(name)} (${abspath})`,
        task: function workspaceTask(ctx, self) {
          process.chdir(abspath);
          return final(ctx, self);
        },
      };
    });
    return self.newListr(tasks, { concurrent: false });
  };
}
