declare namespace t {
  interface PropertyDescriptor<T = unknown> {
    configurable?: boolean;
    enumerable?: boolean;
    value?: T;
    writable?: boolean;
    get?(): T;
    set?(v: T): void;
  }

  namespace Array {
    interface isArray {
      <T, U>(arg: T[] | U): arg is T[];
      <T, U>(arg: readonly T[] | U): arg is readonly T[];
      <T, U>(arg: readonly T[] | T[] | U): arg is readonly T[];
      (arg: unknown): arg is AnyArray;
    }
  }

  namespace Object {
    namespace prototype {
      interface hasOwnProperty {
        (v: PropertyKey): v is keyof this;
        call<T>(self: T, v: PropertyKey): v is keyof T;
        apply<T>(self: T, args: [v: PropertyKey]): args is [v: keyof T];
      }
    }

    interface defineProperty {
      <T, U extends keyof T>(o: T, p: U, a: t.PropertyDescriptor<T[U]> & ThisType<T>): T;
      <T, U extends PropertyKey, V>(o: T, p: U, a: t.PropertyDescriptor<V> & ThisType<T>): T &
        { [key in U]: V };
    }

    interface entries {
      <T>(v: T): { [Key in keyof T]: [Key, T[Key]] }[keyof T][];
    }

    interface getOwnPropertyNames {
      <T>(v: T): (keyof T)[];
    }
  }
}
