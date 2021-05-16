import { createWriteStream } from 'fs';
import { Signale } from 'signale';
import { env } from './env';

export const signale = new Signale({
  logLevel: env.DEBUG ? 'info' : 'warn',
  stream: getSignaleStream() as never,
});

function getSignaleStream(): NodeJS.WritableStream | undefined {
  if (env.LOG_FILE === undefined) return;

  const target = ['', '1', 'true'].includes(env.LOG_FILE.toLowerCase())
    ? 'wc-bundler.log'
    : env.LOG_FILE;

  return createWriteStream(target, 'utf8');
}
