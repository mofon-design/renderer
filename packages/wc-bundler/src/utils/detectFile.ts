import { stat, statSync } from 'fs';
import { resolve } from 'path';
import { CLIRuntimeCache } from './CLIRuntimeCache';

const cache = new CLIRuntimeCache(new Map<string, boolean>(), function flush(filter) {
  this.value.forEach((_value, key) => {
    if (filter()) {
      this.value.delete(key);
      this.used -= key.length;
    }
  });
});

export function detectFile(path: string): boolean;
export function detectFile(path: string, sync: false): Promise<boolean>;
export function detectFile(path: string, sync = true): boolean | Promise<boolean> {
  path = resolve(path);

  if (sync) {
    if (cache.value.has(path)) {
      return cache.value.get(path) || false;
    }

    let isFile = false;
    try {
      isFile = statSync(path).isFile();
    } catch {}

    if (cache.use(path.length)) {
      cache.value.set(path, isFile);
    }

    return isFile;
  }

  if (cache.value.has(path)) {
    return Promise.resolve(cache.value.get(path) || false);
  }

  return new Promise<boolean>((resolve) => {
    stat(path, function statCallback(error, stats) {
      let isFile = false;

      if (!error) {
        try {
          isFile = stats.isFile();
        } catch {}
      }

      if (cache.use(path.length)) {
        cache.value.set(path, isFile);
      }

      resolve(isFile);
    });
  });
}
