import chalk from 'chalk';
import type { ListrTask } from 'listr2';
import type { ResolvedWorkspaceConfig, WorkspaceConfig } from '../config';
import { loadWorkspaceConfig } from '../config';
import { allocateColor } from '../utils';

declare global {
  interface Listr2Ctx {
    workspaces?: ResolvedWorkspaceConfig;
  }
}

export function workspace(
  config: t.Readonly<WorkspaceConfig> | undefined,
  final: ListrTask<Listr2Ctx> | ListrTask<Listr2Ctx>[],
): ListrTask<Listr2Ctx>[] {
  return [
    {
      title: 'Detecting packages at current workspace...',
      task(ctx) {
        ctx.workspaces = loadWorkspaceConfig(config);
      },
    },
    {
      title: 'Running tasks for each package...',
      skip(ctx) {
        if (!ctx.workspaces?.length) return `No package found at ${process.cwd()}`;
        return false;
      },
      task(ctx, task) {
        if (!ctx.workspaces?.length) return;

        const tasks: ListrTask<Listr2Ctx>[] = ctx.workspaces.map(({ abspath, name }) => {
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
    },
  ];
}
