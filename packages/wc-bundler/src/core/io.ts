import del from 'del';
import { dest, series, src } from 'gulp';
import type { ListrTask } from 'listr2';
import type { BundleIOConfig } from '../config';
import { loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { env, plumber } from '../utils';

export function withIO(
  config: t.Readonly<BundleIOConfig> | undefined,
  pipe: (upstream: NodeJS.ReadWriteStream) => NodeJS.ReadWriteStream,
): ListrTask<Listr2Ctx>['task'] {
  return function IOTask(_ctx, task) {
    const resolved = loadBundleIOConfig(config);

    return task.newListr([
      {
        title: 'Cleaning up...',
        task: async function cleanTask() {
          await del(resolved.outdir);
        },
      },
      {
        title: 'Running task...',
        task: async function IOTask() {
          return new Promise<void>((resolve, reject) => {
            series(() => {
              const enablePlumber = !env.DEBUG;
              let stream = src(resolved.entry);
              if (enablePlumber) stream = stream.pipe(plumber(onerror));
              stream = pipe(stream).pipe(createExtnamePipeline(resolved.extname));
              if (enablePlumber) stream = stream.pipe(plumber.stop());
              return stream.pipe(dest(resolved.outdir));
            })((error) => (error ? reject(error) : resolve()));
          });
        },
      },
    ]);
  };
}

function onerror() {
  if (!process.exitCode) process.exitCode = 1;
}
