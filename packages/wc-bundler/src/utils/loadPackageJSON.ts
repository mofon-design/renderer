import { join, resolve } from 'path';
import signale from 'signale';
import { env } from './env';

export function loadPackageJSON(cwd?: string): t.UnknownRecord | null {
  let pkg: t.UnknownRecord | null = null;

  try {
    pkg = require(cwd === undefined ? resolve('package.json') : join(cwd, 'package.json'));
    if (typeof pkg !== 'object') pkg = null;
  } catch (error) {
    if (env.DEBUG) signale.error(error);
  }

  return pkg;
}
