import { sync as globSync } from 'glob';
import { relative, resolve } from 'path';
import { asArray, loadPackageJSON, loadPackageName, slash } from '../../utils';
import type { ResolvedWorkspaceConfig, WorkspaceConfig, WorkspacePackageInfo } from './interface';
import { DefaultWorkspaceConfig } from './interface';

export function loadWorkspaceConfig(
  config: t.Readonly<WorkspaceConfig> = DefaultWorkspaceConfig(),
): ResolvedWorkspaceConfig {
  const ptnsets: (readonly string[])[] = [];

  if (config.packages !== undefined) {
    ptnsets.push(asArray(config.packages));
  }

  if ((config.lerna === undefined && config.packages === undefined) || config.lerna) {
    try {
      const lerna = require(resolve('lerna.json')) as t.AnyRecord;
      if (typeof lerna === 'object' && lerna?.packages) {
        ptnsets.push(asArray(lerna.packages));
      }
    } catch {}
  }

  if ((config.packageJSON === undefined && config.packages === undefined) || config.packageJSON) {
    const pkg = loadPackageJSON();
    if (pkg && typeof pkg.workspaces === 'object') {
      const workspaces = pkg.workspaces as t.AnyRecord | null;
      if (workspaces && workspaces.packages) {
        ptnsets.push(asArray(workspaces.packages));
      }
    }
  }

  let pathset: Set<string> | undefined;

  for (const patterns of ptnsets) {
    const paths = patterns.reduce<string[]>((paths, pattern) => {
      pattern = slash(pattern);
      pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;
      return paths.concat(globSync(pattern, { absolute: true, ignore: config.ignore }));
    }, []);

    if (pathset === undefined) {
      pathset = new Set(paths);
    } else {
      const omit = new Set(pathset);
      for (const abspath of paths) omit.delete(abspath);
      for (const abspath of omit) pathset.delete(abspath);
    }
  }

  if (pathset === undefined) return [];

  const cwd = process.cwd();
  const pathNameMap = new Map<string, string>();

  for (const abspath of pathset) {
    if (relative(abspath, cwd) !== '') {
      pathNameMap.set(abspath, loadPackageName(abspath));
    }
  }

  return transformPathNameMap(pathNameMap);
}

function transformPathNameMap(map: Map<string, string>): WorkspacePackageInfo[] {
  return Array.from(map).map((entry) => ({ abspath: entry[0], name: entry[1] }));
}
