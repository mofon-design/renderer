import type { ListrTask } from 'listr2';
import { rollup } from 'rollup';
import signale from 'signale';
import type { UMDModuleConfig } from '../config';
import { loadUMDModuleConfig } from '../config';
import { env } from '../utils';

export function umd(config?: t.Readonly<UMDModuleConfig>): ListrTask {
  return {
    title: 'Transform to UMD module',
    task: async function umdTask() {
      const resolved = loadUMDModuleConfig(config);
      if (env.DEBUG) signale.debug(resolved);
      const bundle = await rollup(resolved);
      await bundle.write(resolved.output);
      await bundle.close();
    },
  };
}
