import { createWriteStream } from 'fs';
import type { DefaultMethods, LoggerFunc } from 'signale';
import { Signale } from 'signale';
import { env } from './env';

interface ExtendedSignale<Types extends PropertyKey = DefaultMethods> extends Signale {
  json: Record<Types, LoggerFunc>;
}

export const signale = new Signale({
  logLevel: env.DEBUG ? 'info' : 'warn',
  stream: getSignaleStream() as never,
}) as ExtendedSignale;

signale.json = new Proxy(Object.create(null), {
  get(target, propertyKey, receiver) {
    if (!Reflect.getOwnPropertyDescriptor(target, propertyKey) && propertyKey in signale) {
      let logger: LoggerFunc;

      if (env.DEBUG) {
        logger = function logger() {
          return signale[propertyKey as DefaultMethods].apply(signale, toJSON(arguments));
        };
      } else {
        logger = function logger() {
          return signale[propertyKey as DefaultMethods].apply(signale, arguments as never);
        };
      }

      Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        value: logger,
      });
    }

    return Reflect.get(target, propertyKey, receiver);
  },
});

function toJSON(messages: IArguments) {
  return Array.from(messages).map((message) => {
    return typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
  });
}

function getSignaleStream(): NodeJS.WritableStream | undefined {
  if (env.LOG_FILE === undefined) return;

  const target = ['', '1', 'true'].includes(env.LOG_FILE.toLowerCase())
    ? 'wc-bundler.log'
    : env.LOG_FILE;

  return createWriteStream(target, 'utf8');
}
