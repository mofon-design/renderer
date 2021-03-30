/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace t {
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

  type AnyRecord = Record<PropertyKey, any>;
}
