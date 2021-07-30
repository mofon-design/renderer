import t from 'types-lib';
import ts from 'typescript';

export const libMap: ReadonlyMap<string, string> = (ts as t.AnyRecord).libMap;

export const libPathMap: ReadonlyMap<string, string> = new Map(
  Array.from(libMap.entries()).map(([key, value]) => [value, key] as const),
);
