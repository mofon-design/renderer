import type { ListrBaseClassOptions, ListrRendererValue } from 'listr2';
import { env } from '../../utils';

export function loadListr2Config(
  ctx: Listr2Ctx,
): ListrBaseClassOptions<Listr2Ctx, ListrRendererValue, ListrRendererValue> {
  const config: ListrBaseClassOptions<Listr2Ctx, ListrRendererValue, ListrRendererValue> = {
    ctx,
    exitOnError: env.DEBUG,
    nonTTYRenderer: 'verbose',
    registerSignalListeners: false,
  };

  if ((env.DEBUG && env.LOG_FILE === undefined) || env.TERM === 'dumb') {
    config.renderer = 'verbose';
  } else if (env.SILENT) {
    config.renderer = 'silent';
  } else {
    config.renderer = 'default';
    config.rendererOptions = { collapse: false, dateFormat: false };
  }

  return config;
}
