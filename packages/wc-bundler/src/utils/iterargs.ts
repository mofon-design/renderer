export function iterargs<T>(args: IArguments): IterableIterator<T> {
  if (args.length === 1 && Array.isArray(args[0])) {
    return args[0][Symbol.iterator]();
  }

  return args[Symbol.iterator]();
}
