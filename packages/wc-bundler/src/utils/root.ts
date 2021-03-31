import { resolve } from 'path';
import { slash } from './slash';

export const root = slash(process.cwd());

export function isRoot(path = process.cwd()): boolean {
  return root === slash(resolve(path));
}
