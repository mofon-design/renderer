declare namespace t {
  namespace Object {
    namespace prototype {
      interface hasOwnProperty {
        (v: PropertyKey): v is keyof this;
        call<T>(self: T, v: PropertyKey): v is keyof T;
        apply<T>(self: T, args: [v: PropertyKey]): v is keyof T;
      }
    }

    interface entries {
      <T>(v: T): { [Key in keyof T]: [Key, T[Key]] }[keyof T][];
    }

    interface getOwnPropertyNames {
      <T>(v: T): (keyof T)[];
    }
  }
}
