import type { ListrBaseClassOptions, ListrRendererValue } from 'listr2';
import { env } from '../../utils';
import { CustomLogger } from './logger';

export function loadListr2Config(
  ctx: Listr2Ctx,
): ListrBaseClassOptions<Listr2Ctx, ListrRendererValue, ListrRendererValue> {
  const config: ListrBaseClassOptions<Listr2Ctx, ListrRendererValue, ListrRendererValue> = {
    ctx,
    exitOnError: env.DEBUG,
    nonTTYRenderer: 'verbose',
    registerSignalListeners: false,
    rendererOptions: { logger: CustomLogger },
  };

  if (env.DEBUG || env.LOG_FILE || env.TERM === 'dumb') {
    setRenderer(config, 'verbose');
  } else if (env.SILENT) {
    setRenderer(config, 'silent');
  } else {
    setRenderer(config, 'default');
    config.rendererOptions = { ...config.rendererOptions, collapse: false };
  }

  return config;
}

function setRenderer<Renderer extends ListrRendererValue>(
  config: ListrBaseClassOptions<Listr2Ctx, ListrRendererValue, ListrRendererValue>,
  renderer: Renderer,
): asserts config is ListrBaseClassOptions<Listr2Ctx, Renderer, Renderer> {
  config.renderer = renderer;
}
