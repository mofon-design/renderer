import type { Chalk } from 'chalk';
import { CLIRuntimeCache } from './CLIRuntimeCache';

type ChalkColors = {
  [Key in keyof Chalk]: Chalk[Key] extends Chalk ? Key : never;
}[keyof Chalk];

const AvailableColors: ChalkColors[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
];

const cache = new CLIRuntimeCache(new Map<string, ChalkColors>(), function flush(filter) {
  this.value.forEach((value, key) => {
    if (filter()) {
      this.value.delete(key);
      this.used -= value.length + key.length;
    }
  });
});

export function allocateColor(token: string): ChalkColors {
  const allocated = cache.value.get(token);
  if (allocated !== undefined) return allocated;

  const next = allocateColor.availableColors.shift() || AvailableColors[0];
  allocateColor.availableColors.push(next);
  if (cache.use(token.length + next.length)) cache.value.set(token, next);
  return next;
}

allocateColor.availableColors = AvailableColors.concat();
