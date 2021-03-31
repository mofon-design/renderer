import { sync as globSync } from 'glob';
import { basename, join, resolve } from 'path';
import { loadModuleByBabel, slash } from '../../utils';
import type { ResolvedWorkspaceConfig, WorkspaceConfig, WorkspacePackageInfo } from './interface';

export function loadWorkspaceConfig(
  config: t.Readonly<WorkspaceConfig> = {},
): ResolvedWorkspaceConfig {
  const ptnsets: (readonly string[])[] = [];

  if (config.packages !== undefined) {
    ptnsets.push(asArray(config.packages));
  }

  if (config.lerna === undefined || config.lerna) {
    const lerna = loadModuleByBabel(resolve('lerna.json')) as t.AnyRecord;
    if (typeof lerna === 'object' && lerna?.packages) {
      ptnsets.push(asArray(lerna.packages));
    }
  }

  if (config.packageJSON === undefined || config.packageJSON) {
    const pkg = loadModuleByBabel(resolve('package.json')) as t.AnyRecord;
    if (typeof pkg === 'object' && typeof pkg?.workspaces === 'object' && pkg.workspaces.packages) {
      ptnsets.push(asArray(pkg.workspaces.packages));
    }
  }

  const cwd = slash(process.cwd());
  const pathset = new Set([cwd]);

  for (const patterns of ptnsets) {
    const paths = patterns.reduce<string[]>((paths, pattern) => {
      pattern = slash(pattern);
      pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;
      return paths.concat(globSync(pattern, { absolute: true, ignore: config.ignore }));
    }, []);

    const omit = new Set(pathset);
    paths.forEach((p) => omit.delete(p));
    omit.forEach((p) => (pathset as Set<string>).delete(p));
  }

  const pathNameMap = new Map<string, string>();
  const namePathMap = new Map<string, Set<string>>();

  for (const abspath of pathset) {
    const pkg = loadModuleByBabel(join(abspath, 'package.json')) as t.UnknownRecord;
    const name =
      typeof pkg === 'object' && typeof pkg?.name === 'string' ? pkg.name : basename(abspath);
    pathNameMap.set(abspath, name);
    namePathMap.set(name, (namePathMap.get(name) || new Set()).add(abspath));
  }

  if (!pathNameMap.size) throw new Error(`Workspace empty (${cwd})`);

  if (pathNameMap.size === 1) return transformPathNameMap(pathNameMap)[0];

  if (!Array.isArray(config.series)) {
    return [config.series ? 'series' : 'parallel', transformPathNameMap(pathNameMap)];
  }

  const series: ResolvedWorkspaceConfig[] = [];

  for (const pattern of config.series) {
    const abspaths = namePathMap.get(pattern);

    if (abspaths !== undefined) {
      namePathMap.delete(pattern);
      abspaths.forEach((abspath) => {
        pathNameMap.delete(abspath);
        series.push({ abspath, name: pattern });
      });
    } else {
      const pkgs: WorkspacePackageInfo[] = [];

      globSync(pattern, { absolute: true, ignore: config.ignore }).forEach((abspath) => {
        const name = pathNameMap.get(abspath);
        if (name === undefined) return;
        pathNameMap.delete(abspath);
        namePathMap.get(name)?.delete(abspath);
        pkgs.push({ abspath, name });
      });

      if (pkgs.length) {
        series.push(pkgs.length === 1 ? pkgs[0] : ['parallel', pkgs]);
      }
    }
  }

  series.push(['parallel', transformPathNameMap(pathNameMap)]);

  return ['series', series];
}

function transformPathNameMap(map: Map<string, string>): WorkspacePackageInfo[] {
  return Array.from(map).map((entry) => ({ abspath: entry[0], name: entry[1] }));
}

function asArray(pattern: string | readonly string[]): readonly string[] {
  return Array.isArray(pattern) ? pattern : [pattern];
}