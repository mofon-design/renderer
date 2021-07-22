export default t;

declare namespace t {
  // Any

  type AnyArray = any[];

  interface AnyConstructor {
    new (...args: any[]): any;
  }

  interface AnyClass extends AnyConstructor {
    prototype: any;
  }

  interface AnyFunction {
    (...args: any[]): any;
  }

  type AnyRecord<Key extends PropertyKey = PropertyKey> = Record<Key, any>;

  // Unknown

  type UnknownArray = unknown[];

  type UnknownRecord<Key extends PropertyKey = PropertyKey> = Record<Key, unknown>;

  // Readonly

  // eslint-disable-next-line @typescript-eslint/ban-types
  interface ReadonlyWeakMap<K extends object, V> extends Omit<WeakMap<K, V>, 'delete' | 'set'> {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  interface ReadonlyWeakSet<K extends object> extends Omit<WeakSet<K>, 'add' | 'delete'> {}

  type Readonly<T> = T extends WeakMap<infer Key, infer Value>
    ? ReadonlyWeakMap<Key, t.Readonly<Value>>
    : T extends Map<infer Key, infer Value>
    ? ReadonlyMap<Key, t.Readonly<Value>>
    : T extends Set<infer Value>
    ? ReadonlySet<Value>
    : T extends WeakSet<infer Value>
    ? ReadonlyWeakSet<Value>
    : T extends Array<infer Value>
    ? ReadonlyArray<t.Readonly<Value>>
    : {
        readonly [Key in keyof T]: t.Readonly<T[Key]>;
      };

  type PowerReadonly<T> = T extends WeakMap<infer Key, infer Value>
    ? ReadonlyWeakMap<PowerReadonly<Key>, PowerReadonly<Value>>
    : T extends Map<infer Key, infer Value>
    ? ReadonlyMap<PowerReadonly<Key>, PowerReadonly<Value>>
    : T extends Set<infer Value>
    ? ReadonlySet<PowerReadonly<Value>>
    : T extends WeakSet<infer Value>
    ? ReadonlyWeakSet<PowerReadonly<Value>>
    : T extends Array<infer Value>
    ? ReadonlyArray<PowerReadonly<Value>>
    : {
        readonly [Key in keyof T]: PowerReadonly<T[Key]>;
      };

  // ES
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
      <T>(v: T): (keyof T & string)[];
    }

    interface getOwnPropertySymbols {
      <T>(v: T): (keyof T & symbol)[];
    }
  }
}
