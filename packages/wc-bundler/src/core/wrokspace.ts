import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { WorkspaceConfig } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor } from '../utils';

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  final: ListrTask<Listr2Ctx> | ListrTask<Listr2Ctx>[],
): ListrTask<Listr2Ctx> {
  return {
    title: 'Detecting packages at current workspace...',
    task(_ctx, task) {
      const resolved = loadWorkspaceConfig(config);
      if (!resolved.length) return task.skip(`No package found at ${process.cwd()}`);

      task.title = 'Running tasks for each package...';
      const tasks: ListrTask<Listr2Ctx>[] = resolved.map(({ abspath, name }) => {
        return {
          title: `${chalk[allocateColor(name)].bold(name)} (${abspath})`,
          task: function workspaceTask(_ctx, task) {
            process.chdir(abspath);
            return task.newListr(final, { concurrent: true });
          },
        };
      });
      return task.newListr(tasks, { concurrent: false });
    },
  };
}
