import type { TransformOptions } from '@babel/core';
import { loadBabelConfig } from '../config';
import { env } from './env';
import { escapeRegExp } from './escapeRegExp';
import { root } from './root';

let registering = false;
let tryToRegisterAgainDuringRegistering: boolean | null = false;
let registeredOptions: TransformOptions | undefined | symbol = Symbol('Empty');

export function registerBabel(options?: TransformOptions): void {
  if (registeredOptions === options) return;

  if (registering) {
    if (tryToRegisterAgainDuringRegistering !== null) tryToRegisterAgainDuringRegistering = true;
    return;
  }

  registering = true;

  const fallback = loadBabelConfig({
    env: { targets: { node: process.version } },
    typescript: true,
  });

  const override = {
    cache: !env.DISABLE_CLI_RUNTIME_CACHE,
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
    ignore: [/node_modules/],
    only: [RegExp(`^${escapeRegExp(root)}`, 'i')],
  };

  require('@babel/register')(Object.assign(fallback, override, options));

  registering = false;

  if (tryToRegisterAgainDuringRegistering) {
    tryToRegisterAgainDuringRegistering = null;
    registerBabel(options);
    tryToRegisterAgainDuringRegistering = false;
  }

  registeredOptions = options;
}
