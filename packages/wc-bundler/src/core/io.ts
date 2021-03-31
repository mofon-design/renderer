import * as del from 'del';
import { TaskFunction, dest, src, series } from 'gulp';
import * as plumber from 'gulp-plumber';
import { BundleIOConfig, loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { defineLazyLoadProperty } from '../utils';

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
      return pipe(src(ref.config.entry).pipe(plumber()))
        .pipe(createExtnamePipeline(ref.config.extname))
        .pipe(dest(ref.config.outdir));
    },
  );
}
