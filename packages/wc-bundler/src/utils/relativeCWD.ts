import { relative } from 'path';

export function relativeCWD(path: string): string {
  return relative(process.cwd(), path);
}
