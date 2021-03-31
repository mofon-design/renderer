export function defineLazyLoadProperty<Target, Key extends PropertyKey, Value>(
  target: Target,
  key: Key,
  load: () => Value,
): Target & { [key in Key]: Value };
export function defineLazyLoadProperty<Target, Key extends keyof Target, Value>(
  target: Target,
  key: Key,
  load: () => Value,
): Target;
export function defineLazyLoadProperty<Target, Key extends keyof Target, Value>(
  target: Target,
  key: Key,
  load: () => Value,
): Target {
  (Object.defineProperty as t.Object.defineProperty)(target, key, {
    configurable: true,
    get() {
      const value = load();
      (Object.defineProperty as t.Object.defineProperty)(target, key, {
        configurable: true,
        value,
      });
      return value;
    },
  });

  return target;
}
