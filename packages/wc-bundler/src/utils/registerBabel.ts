import type { TransformOptions } from '@babel/core';
import { transformBabelConfig } from '../config';
import { env } from './env';
import { escapeRegExp } from './escapeRegExp';
import { root } from './root';

let registered = false;

export function registerBabel(options?: TransformOptions): void {
  if (registered) return;

  const fallback = transformBabelConfig({
    env: { targets: { node: process.version } },
    typescript: true,
  });

  const override = {
    cache: !env.DISABLE_CLI_RUNTIME_CACHE,
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
    ignore: [/node_modules/],
    only: [RegExp(`^${escapeRegExp(root)}`, 'i')],
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@babel/register')(Object.assign(fallback, options, override));

  registered = true;
}
