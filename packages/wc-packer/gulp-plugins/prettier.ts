import type {
  Options as PrettierOptions,
  ResolveConfigOptions as PrettierResolveConfigOptions,
} from 'prettier';
import { format, resolveConfig } from 'prettier';
import type { Transform } from 'stream';
import { obj } from 'through2';
import type * as File from 'vinyl';
import { readVinylFile } from './_utils';

export interface GulpPrettierOptions extends PrettierOptions {
  filepath?: never;
}

export interface GulpPrettierResolveConfigOptions extends PrettierResolveConfigOptions {
  useCache?: boolean;
}

const ResolveConfigDefaultOptions: GulpPrettierResolveConfigOptions = {
  editorconfig: true,
  useCache: true,
};

export function GulpPrettier(
  options: GulpPrettierOptions = {},
  resolveConfigOptions?: PrettierResolveConfigOptions,
) {
  const resolvePrettierConfig = createPrettierConfigResolver(resolveConfigOptions);

  return obj(function PrettierFormatter(this: Transform, file: File, encoding, end) {
    const contents = readVinylFile(file, encoding);
    if (contents === null) return end(null, null);

    resolvePrettierConfig(file.path)
      .then((config) => {
        const formatted = format(contents, { ...config, ...options, filepath: file.path });
        if (formatted !== contents) file.contents = Buffer.from(formatted);
        end(null, file);
      })
      .catch((error) => end(error, null));
  });
}

function createPrettierConfigResolver(
  options: PrettierResolveConfigOptions | undefined,
): (filepath: string) => Promise<PrettierOptions | null> {
  options = { ...ResolveConfigDefaultOptions, ...options };

  if (options.useCache) {
    const cached = resolveConfig(process.cwd(), options);
    return function resolvePrettierConfig() {
      return cached;
    };
  }

  return function resolvePrettierConfig(filepath: string) {
    return resolveConfig(filepath, options);
  };
}
