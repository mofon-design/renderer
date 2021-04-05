import { TaskFunction, dest, src, series } from 'gulp';
import { BundleIOConfig, loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { defineLazyLoadProperty, del, env, plumber } from '../utils';

export function withIO(
  config: t.Readonly<BundleIOConfig> | undefined,
  pipe: (upstream: NodeJS.ReadWriteStream) => NodeJS.ReadWriteStream,
): TaskFunction {
  const ref = defineLazyLoadProperty({}, 'config', () => loadBundleIOConfig(config));
  return series(
    function cleanTask() {
      return del(ref.config.outdir);
    },
    function ioTask() {
      const enablePlumber = !env.DEBUG;
      let stream = src(ref.config.entry);
      if (enablePlumber) stream = stream.pipe(plumber(onerror));
      stream = pipe(stream).pipe(createExtnamePipeline(ref.config.extname));
      if (enablePlumber) stream = stream.pipe(plumber.stop());
      return stream.pipe(dest(ref.config.outdir));
    },
  );
}

function onerror() {
  if (!process.exitCode) process.exitCode = 1;
}
