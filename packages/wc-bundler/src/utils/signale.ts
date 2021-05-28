import { Signale } from 'lazy-signale';
import { env } from './env';
import { LogFileStream } from './log';

export const signale = new Signale({
  colorLevel: env.LOG_FILE !== undefined ? 0 : undefined,
  logLevel: env.DEBUG ? 'info' : 'warn',
  stream: LogFileStream,
});
