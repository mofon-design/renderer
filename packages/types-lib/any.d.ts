/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace t {
  interface AnyConstructor {
    new (...args: any[]): any;
  }

  interface AnyClass extends AnyConstructor {
    prototype: any;
  }
}
