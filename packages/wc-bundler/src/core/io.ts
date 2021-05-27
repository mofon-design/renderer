import del from 'del';
import { dest, series } from 'gulp';
import type { ListrRenderer, ListrTask } from 'listr2';
import type { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import type { BundleIOConfig } from '../config';
import { loadBundleIOConfig } from '../config';
import { createExtnamePipeline } from '../pipelines';
import { env, hideDEP0097, plumber } from '../utils';

export interface WithIOStreamHooks {
  after(upstream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream;
  before(upstream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream;
  prepare(): Promise<void>;
}

export function withIO<
  Renderer extends typeof ListrRenderer,
  ResolvedConfig extends Required<BundleIOConfig>
>(
  config: () => ResolvedConfig,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: ResolvedConfig,
    hooks: WithIOStreamHooks,
  ) => NodeJS.ReadWriteStream | void | Promise<NodeJS.ReadWriteStream | void>,
): ListrTask<Listr2Ctx>;
export function withIO<Renderer extends typeof ListrRenderer>(
  config: t.Readonly<BundleIOConfig> | undefined,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: Required<BundleIOConfig>,
    hooks: WithIOStreamHooks,
  ) => NodeJS.ReadWriteStream | void | Promise<NodeJS.ReadWriteStream | void>,
): ListrTask<Listr2Ctx>;
export function withIO<Renderer extends typeof ListrRenderer>(
  config: (() => Required<BundleIOConfig>) | t.Readonly<BundleIOConfig> | undefined,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: Required<BundleIOConfig>,
    hooks: WithIOStreamHooks,
  ) => NodeJS.ReadWriteStream | void | Promise<NodeJS.ReadWriteStream | void>,
): ListrTask<Listr2Ctx> {
  return {
    title: 'IO task',
    task: async function IOTask(_ctx, self) {
      const resolved = loadConfig();
      const stream = await pipe(self, resolved, createHook());
      if (!stream) return;

      return new Promise<void>((resolve, reject) => {
        series(() => stream)((error) => (error ? reject(error) : resolve()));
      });

      function createHook(): WithIOStreamHooks {
        const enablePlumber = !env.DEBUG;

        return {
          after(stream) {
            stream = stream
              .pipe(createExtnamePipeline(resolved.extname))
              .pipe(dest(resolved.outdir));

            if (enablePlumber) stream = stream.pipe(plumber.stop());

            return stream;
          },
          before(stream) {
            self.title = 'Start IO task...';

            if (enablePlumber) stream = stream.pipe(plumber(onerror));

            return stream;
          },
          async prepare() {
            self.title = 'Cleaning up...';

            hideDEP0097();

            if (resolved.cleanOutdir) await del(resolved.outdir);
          },
        };
      }
    },
  };

  function loadConfig() {
    return typeof config === 'function' ? config() : loadBundleIOConfig(config);
  }
}

function onerror() {
  if (!process.exitCode) process.exitCode = 1;
}
