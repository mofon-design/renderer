import { join } from 'path';
import tempdir from 'temp-dir';

export function tmpdir(): string {
  return join(tempdir, Math.random().toString(16).slice(2));
}
