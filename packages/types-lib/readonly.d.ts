declare namespace t {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface ReadonlyWeakMap<K extends object, V> extends WeakMap<K, V> {
    delete?: never;
    set?: never;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  interface ReadonlyWeakSet<K extends object, V> extends WeakSet<K, V> {
    add?: never;
    delete?: never;
  }

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
}
