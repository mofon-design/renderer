export type ExtSatisfiesRange =
  | string[]
  | {
      include?: ExtSatisfiesRange | ExtSatisfiesRange[];
      exclude?: ExtSatisfiesRange | ExtSatisfiesRange[];
    };

export function extSatisfies(filename: string, range: t.Readonly<ExtSatisfiesRange>): boolean {
  if ((Array.isArray as t.Array.isArray)(range)) {
    return range.some((ext) => filename.endsWith(ext));
  }

  if (range.include) {
    if (
      (Array.isArray as t.Array.isArray)<
        t.Readonly<ExtSatisfiesRange> | string,
        t.Readonly<ExtSatisfiesRange>
      >(range.include)
    ) {
      const satisfiesIncludePtn = range.include.some((exts) => {
        if (typeof exts === 'string') return filename.endsWith(exts);
        if ((Array.isArray as t.Array.isArray)(exts))
          return exts.some((ext) => filename.endsWith(ext));
        return extSatisfies(filename, exts);
      });

      if (!satisfiesIncludePtn) return false;
    } else {
      if (!extSatisfies(filename, range.include)) return false;
    }
  }

  if (range.exclude) {
    if (
      (Array.isArray as t.Array.isArray)<
        t.Readonly<ExtSatisfiesRange> | string,
        t.Readonly<ExtSatisfiesRange>
      >(range.exclude)
    ) {
      const satisfiesExcludePtn = range.exclude.some((exts) => {
        if (typeof exts === 'string') return filename.endsWith(exts);
        if ((Array.isArray as t.Array.isArray)(exts))
          return exts.some((ext) => filename.endsWith(ext));
        return extSatisfies(filename, exts);
      });

      if (satisfiesExcludePtn) return false;
    } else {
      if (extSatisfies(filename, range.exclude)) return false;
    }
  }

  return true;
}
