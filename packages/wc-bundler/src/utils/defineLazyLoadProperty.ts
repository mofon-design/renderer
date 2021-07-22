import type t from 'types-lib';

export function defineLazyLoadProperty<Target, Key extends keyof Target, Value>(
  target: Target,
  key: Key,
  load: (this: Target) => Value,
): Target;
export function defineLazyLoadProperty<Target, Key extends PropertyKey, Value>(
  target: Target,
  key: Key,
  load: (this: Target) => Value,
): Target & { [key in Key]: Value };
export function defineLazyLoadProperty<Target, Key extends keyof Target, Value>(
  target: Target,
  key: Key,
  load: (this: Target) => Value,
): Target {
  (Object.defineProperty as t.Object.defineProperty)(target, key, {
    configurable: true,
    get(this: Target) {
      const value = load.call(this);
      (Object.defineProperty as t.Object.defineProperty)(target, key, {
        configurable: true,
        value,
        writable: false,
      });
      return value;
    },
  });

  return target;
}
