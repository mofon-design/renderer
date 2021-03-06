import type { ListrTask } from 'listr2';
import { rollup } from 'rollup';
import type t from 'types-lib';
import type { UMDModuleConfig } from '../config';
import { loadUMDModuleConfig } from '../config';
import { json, signale } from '../utils';

export function umd(config?: t.Readonly<UMDModuleConfig>): ListrTask {
  return {
    title: 'Transform to UMD module',
    task: async function umdTask() {
      const resolved = loadUMDModuleConfig(config);
      signale.debug(() => ['Resolved umd config:', json(resolved)]);
      const bundle = await rollup(resolved);
      await bundle.write(resolved.output);
      await bundle.close();
    },
  };
}
