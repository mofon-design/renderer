import { createWriteStream } from 'fs';
import { env } from './env';

export const LogFileStream = getLogFileStream();

function getLogFileStream() {
  if (env.LOG_FILE === undefined) return;

  const target = ['', '1', 'true'].includes(env.LOG_FILE.toLowerCase())
    ? 'wc-bundler.log'
    : env.LOG_FILE;

  return createWriteStream(target, 'utf8');
}
