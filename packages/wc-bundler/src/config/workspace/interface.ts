export interface WorkspaceConfig {
  /**
   * Ignore pattern(s).
   */
  ignore?: string | string[];
  /**
   * Apply lerna config.
   *
   * @default
   * packages === undefined && fs.statSync('lerna.json').isFile()
   */
  lerna?: boolean;
  /**
   * Apply package.json config.
   *
   * @default
   * packages === undefined && Array.isArray(require('package.json').workspaces.packages)
   */
  packageJSON?: boolean;
  /**
   * Workspace package paths. Glob patterns are supported.
   * Take the intersection with other configurations as the final result.
   */
  packages?: string | string[];
}

export interface WorkspacePackageInfo {
  abspath: string;
  name: string;
}

export type ResolvedWorkspaceConfig = readonly WorkspacePackageInfo[];

export function DefaultWorkspaceConfig(): WorkspaceConfig {
  return {};
}
