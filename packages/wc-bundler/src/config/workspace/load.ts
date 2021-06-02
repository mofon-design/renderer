import { sync as globSync } from 'glob';
import { relative, resolve } from 'path';
import { asArray, loadPackageJSON, loadPackageName, slash } from '../../utils';
import type { ResolvedWorkspaceConfig, WorkspaceConfig, WorkspacePackageInfo } from './interface';
import { DefaultWorkspaceConfig } from './interface';

export function loadWorkspaceConfig(
  config: t.Readonly<WorkspaceConfig> = DefaultWorkspaceConfig(),
): ResolvedWorkspaceConfig {
  const patternsList: (readonly string[])[] = [];

  if (config.packages !== undefined) {
    patternsList.push(asArray(config.packages));
  }

  if ((config.lerna === undefined && config.packages === undefined) || config.lerna) {
    try {
      const lerna = require(resolve('lerna.json')) as t.AnyRecord;
      if (typeof lerna === 'object' && lerna?.packages) {
        patternsList.push(asArray(lerna.packages));
      }
    } catch {}
  }

  if ((config.packageJSON === undefined && config.packages === undefined) || config.packageJSON) {
    const pkg = loadPackageJSON();
    if (pkg && typeof pkg.workspaces === 'object') {
      const workspaces = pkg.workspaces as t.AnyRecord | null;
      if (workspaces && workspaces.packages) {
        patternsList.push(asArray(workspaces.packages));
      }
    }
  }

  let matchedPaths: readonly string[] = [];
  let intersectionOfPatternsList: Set<string> | undefined;

  for (const patterns of patternsList) {
    const paths = patterns.reduce<string[]>((paths, pattern) => {
      pattern = slash(pattern);
      pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;
      return paths.concat(globSync(pattern, { absolute: true, ignore: config.ignore }));
    }, []);

    matchedPaths = matchedPaths.concat(paths);

    if (intersectionOfPatternsList === undefined) {
      intersectionOfPatternsList = new Set(paths);
    } else {
      const rest = intersectionOfPatternsList;
      const omit = new Set(intersectionOfPatternsList);
      paths.forEach((abspath) => omit.delete(abspath));
      omit.forEach((abspath) => rest.delete(abspath));
    }
  }

  if (!intersectionOfPatternsList?.size || !matchedPaths.length) return [];

  const cwd = process.cwd();
  const nonNullableIntersectionOfPatternsList = intersectionOfPatternsList;

  return matchedPaths.reduce<WorkspacePackageInfo[]>((pkgs, abspath) => {
    if (!nonNullableIntersectionOfPatternsList.has(abspath)) return pkgs;
    nonNullableIntersectionOfPatternsList.delete(abspath);

    if (relative(abspath, cwd) === '') return pkgs;
    pkgs.push({ abspath, name: loadPackageName(abspath) });
    return pkgs;
  }, []);
}
