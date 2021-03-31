import { TaskFunction, dest, src, series } from 'gulp';
import { BundleIOConfig, loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { defineLazyLoadProperty, del, plumber } from '../utils';

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
      return pipe(src(ref.config.entry).pipe(plumber()))
        .pipe(createExtnamePipeline(ref.config.extname))
        .pipe(dest(ref.config.outdir));
    },
  );
}
