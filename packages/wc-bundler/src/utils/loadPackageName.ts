import { basename } from 'path';
import { loadPackageJSON } from './loadPackageJSON';

export function loadPackageName(cwd = process.cwd()): string {
  const pkg = loadPackageJSON(cwd);
  return pkg && typeof pkg.name === 'string' ? pkg.name : basename(cwd);
}
