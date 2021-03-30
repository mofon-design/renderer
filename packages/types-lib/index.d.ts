/// <reference path="any.d.ts" />
/// <reference path="es.d.ts" />
/// <reference path="readonly.d.ts" />
/// <reference path="unknown.d.ts" />

declare namespace t {
  type ArgsType<T extends AnyFunction> = T extends (...args: infer Args) => void ? Args : never;
}
