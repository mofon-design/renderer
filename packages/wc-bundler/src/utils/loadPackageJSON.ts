import { join, resolve } from 'path';
import { signale } from './signale';

export function loadPackageJSON(cwd?: string): t.UnknownRecord | null {
  let pkg: t.UnknownRecord | null = null;

  try {
    pkg = require(cwd === undefined ? resolve('package.json') : join(cwd, 'package.json'));
    if (typeof pkg !== 'object') pkg = null;
  } catch (error) {
    signale.note('Load package.json failed:', error);
  }

  return pkg;
}
