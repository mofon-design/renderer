export interface BundleIOConfig {
  /**
   * Specify entry file(s) or directory(s).
   *
   * @default
   * ['src\/**\/*', '!**\/*{demo,e2e,fixture,spec,test}?(s)*\/**', '!**\/*{demo,e2e,fixture,spec,test}.*']
   */
  entry?: string | string[];
  /**
   * Specify extname of output file.
   *
   * @default '.js'
   */
  extname?: string;
  /**
   * Specify output directory.
   *
   * @default 'dist/'
   */
  outdir?: string;
}

export function DefaultBundleIOConfig(): Required<BundleIOConfig> {
  return {
    entry: [
      'src/**/*',
      '!**/*{demo,e2e,fixture,spec,test}?(s)*/**',
      '!**/*{demo,e2e,fixture,spec,test}.*',
    ],
    extname: '.js',
    outdir: 'dist/',
  };
}
