export interface WorkspaceConfig {
  /**
   * Ignore pattern(s).
   */
  ignore?: string | string[];
  /**
   * Apply lerna config.
   *
   * @default fs.statSync('lerna.json').isFile()
   */
  lerna?: boolean;
  /**
   * Apply package.json config.
   *
   * @default Array.isArray(require('package.json').workspaces.packages)
   */
  packageJSON?: boolean;
  /**
   * Workspace package paths. Glob patterns are supported.
   * Take the intersection with other configurations as the final result.
   */
  packages?: string | string[];
  /**
   * Bring the packages under the specified name or path to the top, and ensure their order.
   */
  top?: string[];
}

export type ResolvedWorkspaceConfig = { abspath: string; name: string }[];
