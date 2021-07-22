import del from 'del';
import { dest, series } from 'gulp';
import type { ListrRenderer, ListrTask } from 'listr2';
import type { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import { relative } from 'path';
import type { Stream } from 'stream';
import type t from 'types-lib';
import type { BundleIOConfig, ResolvedBundleIOConfig } from '../config';
import { loadBundleIOConfig } from '../config';
import { env, hideDEP0097, plumber } from '../utils';

export interface WithIOStreamHooks {
  after(upstream: Stream): Stream;
  before(upstream: Stream): Stream;
  prepare(): Promise<void>;
}

export function withIO<
  Renderer extends typeof ListrRenderer,
  ResolvedConfig extends ResolvedBundleIOConfig
>(
  config: () => ResolvedConfig,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: ResolvedConfig,
    hooks: WithIOStreamHooks,
  ) => Stream | void | Promise<Stream | void>,
): ListrTask<Listr2Ctx>;
export function withIO<Renderer extends typeof ListrRenderer>(
  config: t.Readonly<BundleIOConfig> | undefined,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: ResolvedBundleIOConfig,
    hooks: WithIOStreamHooks,
  ) => Stream | void | Promise<Stream | void>,
): ListrTask<Listr2Ctx>;
export function withIO<Renderer extends typeof ListrRenderer>(
  config: (() => ResolvedBundleIOConfig) | t.Readonly<BundleIOConfig> | undefined,
  pipe: (
    task: TaskWrapper<Listr2Ctx, Renderer>,
    config: ResolvedBundleIOConfig,
    hooks: WithIOStreamHooks,
  ) => Stream | void | Promise<Stream | void>,
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
        return {
          after(stream) {
            stream = stream.pipe(dest(resolved.outdir));

            if (env.GULP_PLUMBER) stream = stream.pipe(plumber.stop());

            return stream;
          },
          before(stream) {
            self.title = 'Start IO task...';

            if (env.GULP_PLUMBER) stream = stream.pipe(plumber(onerror));

            return stream;
          },
          async prepare() {
            self.title = 'Cleaning up...';

            hideDEP0097();

            if (typeof resolved.clean === 'string' || Array.isArray(resolved.clean)) {
              await del(resolved.clean);
            } else if (resolved.clean) {
              if (relative(resolved.outdir, process.cwd()) === '')
                self.title = 'Skip clean because outdir is equal to cwd';
              else await del(resolved.outdir);
            }
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
