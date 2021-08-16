export interface BundleIOConfig {
  /**
   * Clean output before start io task.
   *
   * Set `true` to clean outdir.
   *
   * If `clean === true && path.relative(outdir, process.cwd()) === ''`,
   * this step will be skipped.
   *
   * @default true
   */
  clean?: boolean | string | string[];
  /**
   * Specify entry file(s) or directory(s).
   *
   * @default
   * ['src\/**\/*', '!**\/*{demo,e2e,fixture,spec,test}?(s)*\/**', '!**\/*{demo,e2e,fixture,spec,test}.*']
   */
  entry?: string | string[];
  /**
   * Specify output directory.
   *
   * @default 'dist/'
   */
  outdir?: string;
}

export interface ResolvedBundleIOConfig extends Required<BundleIOConfig> {}

export function DefaultBundleIOConfig(): ResolvedBundleIOConfig {
  return {
    clean: true,
    entry: [
      'src/**/*',
      '!**/*{demo,e2e,fixture,mock,spec,test}?(s)*/**',
      '!**/*.*(_){demo,e2e,fixture,mock,spec,test}*(_).*',
    ],
    outdir: 'dist/',
  };
}
