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
    function clean() {
      return del(ref.config.outdir);
    },
    function io() {
      let stream = src(ref.config.entry);
      if (!env.DEBUG) stream = stream.pipe(plumber());
      return pipe(stream)
        .pipe(createExtnamePipeline(ref.config.extname))
        .pipe(dest(ref.config.outdir));
    },
  );
}
