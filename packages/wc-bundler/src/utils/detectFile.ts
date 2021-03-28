import type { PathLike } from 'fs';
import { stat, statSync } from 'fs';

export function detectFile(path: PathLike): boolean;
export function detectFile(path: PathLike, sync: false): Promise<boolean>;
export function detectFile(path: PathLike, sync = true): boolean | Promise<boolean> {
  if (sync) {
    try {
      return statSync(path).isFile();
    } catch {}
    return false;
  }

  return new Promise<boolean>((resolve) => {
    stat(path, function statCallback(error, stats) {
      if (error) return resolve(false);
      try {
        return resolve(stats.isFile());
      } catch {}
      resolve(false);
    });
  });
}
