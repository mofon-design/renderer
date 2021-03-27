import type { TransformOptions } from '@babel/core';
import { escapeRegExp } from 'lodash';
import { transformBabelConfig } from '../config/transformBabelConfig';
import { env } from './env';
import { root } from './root';

let registered = false;

export function registerBabel(options?: TransformOptions): void {
  if (registered) return;

  require('@babel/register')({
    ...transformBabelConfig({ env: { modules: 'commonjs' }, typescript: true }),
    ...options,
    cache: !env.DISABLE_CLI_RUNTIME_CACHE,
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
    ignore: [/node_modules/],
    only: [new RegExp(`^${escapeRegExp(root)}`, 'i')],
  });

  registered = true;
}
