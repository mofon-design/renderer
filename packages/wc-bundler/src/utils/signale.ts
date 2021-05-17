import { createWriteStream } from 'fs';
import { Signale } from 'lazy-signale';
import { env } from './env';

export const signale = new Signale({
  colorLevel: env.LOG_FILE !== undefined ? 0 : undefined,
  logLevel: env.DEBUG ? 'info' : 'warn',
  stream: getSignaleStream(),
});

function getSignaleStream() {
  if (env.LOG_FILE === undefined) return;

  const target = ['', '1', 'true'].includes(env.LOG_FILE.toLowerCase())
    ? 'wc-bundler.log'
    : env.LOG_FILE;

  return createWriteStream(target, 'utf8');
}
