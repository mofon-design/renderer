import type * as File from 'vinyl';

export function readVinylFile(file: File, encoding?: BufferEncoding): string | null {
  let contents: string | Buffer | NodeJS.ReadableStream | null = file.contents;
  if (contents === null) return null;
  if (!(contents instanceof Buffer)) contents = contents.read();
  if (contents instanceof Buffer) contents = contents.toString(encoding);
  return contents;
}
