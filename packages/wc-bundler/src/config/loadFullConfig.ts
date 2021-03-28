import { resolve } from 'path';
import * as signale from 'signale';
import { name as pkgname } from '../../package.json';
import { loadModuleByBabel } from '../utils';
import type { BundleConfig } from './interface';

export function loadFullConfig(): BundleConfig {
  let config: unknown;
  let abspath: string | undefined;

  for (const filename of loadFullConfig.filenames) {
    abspath = resolve(filename);
    if ((config = loadModuleByBabel(abspath))) break;
  }

  if (abspath !== undefined && !config) {
    try {
      abspath = require.resolve(abspath);
      signale.error(`Try to load config from ${abspath} but failed.`);
    } catch {}
  }

  return config as BundleConfig; // TODO validate config
}

loadFullConfig.filenames = ['rc', '.config']
  .map((suffix) => `${pkgname}${suffix}`)
  .map((suffix) => [suffix, `.${suffix}`, `${suffix}.json`])
  .flat(1);
