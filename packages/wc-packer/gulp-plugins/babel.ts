import type { TransformOptions } from '@babel/core';
import { transformAsync } from '@babel/core';
import type { Transform } from 'stream';
import { obj } from 'through2';
import type * as File from 'vinyl';
import { readVinylFile } from './_utils';

export interface GulpBabelOptions extends TransformOptions {
  filename?: never;
  filenameRelative?: never;
  sourceFileName?: never;
}

export function GulpBabel(options: GulpBabelOptions = {}): Transform {
  return obj(function BabelTransformer(this: Transform, file: File, encoding, end) {
    const contents = readVinylFile(file, encoding);
    if (contents === null) return end(null, null);

    transformAsync(contents, {
      ...options,
      caller: { name: 'babel-gulp', ...options.caller },
      filename: file.path,
      filenameRelative: file.relative,
      sourceFileName: file.relative,
    })
      .then((result) => {
        if (!result) return end(null, null);
        file.babel = result.metadata;
        file.extname = file.extname && '.js';
        file.contents = Buffer.from(result.code || '');
        end(null, file);
      })
      .catch((error) => end(error, null));
  });
}
