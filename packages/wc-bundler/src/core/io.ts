import del from 'del';
import { dest, series, src } from 'gulp';
import type { ListrRenderer, ListrTask } from 'listr2';
import type { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import type { BundleIOConfig } from '../config';
import { loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { env, hideDEP0097, plumber } from '../utils';

export function withIO<Renderer extends typeof ListrRenderer>(
  config: t.Readonly<BundleIOConfig> | undefined,
  pipe: (
    upstream: NodeJS.ReadWriteStream,
    task: TaskWrapper<Listr2Ctx, Renderer>,
  ) => NodeJS.ReadWriteStream,
): ListrTask<Listr2Ctx> {
  return {
    title: 'Cleaning up...',
    task: async function IOTask(_ctx, task) {
      hideDEP0097();

      const resolved = loadBundleIOConfig(config);
      await del(resolved.outdir);
      task.title = 'Start IO task...';
      return new Promise<void>((resolve, reject) => {
        series(() => {
          const enablePlumber = !env.DEBUG;
          let stream = src(resolved.entry);
          if (enablePlumber) stream = stream.pipe(plumber(onerror));
          stream = pipe(stream, task).pipe(createExtnamePipeline(resolved.extname));
          if (enablePlumber) stream = stream.pipe(plumber.stop());
          return stream.pipe(dest(resolved.outdir));
        })((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}

function onerror() {
  if (!process.exitCode) process.exitCode = 1;
}
