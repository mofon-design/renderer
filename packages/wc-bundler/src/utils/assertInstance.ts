import type t from 'types-lib';

export function assertInstance<T extends t.AnyConstructor>(
  value: unknown,
  cls: T,
): asserts value is InstanceType<T> {
  if (!(value instanceof cls))
    throw new Error(
      `Assert: \`${value} (${typeof value})\` is not instance of \`${cls} ${typeof cls}\``,
    );
}
