export type ExtSatisfiesRange = string[] | { include?: string[]; exclude?: string[] };

export function extSatisfies(filename: string, range: t.Readonly<ExtSatisfiesRange>): boolean {
  if ((Array.isArray as t.Array.isArray)(range)) return range.some((ext) => filename.endsWith(ext));
  if (range.include && !range.include.some((ext) => filename.endsWith(ext))) return false;
  return !range.exclude?.some((ext) => filename.endsWith(ext));
}
