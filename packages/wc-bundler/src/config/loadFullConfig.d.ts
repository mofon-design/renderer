import type { BundleConfig } from './interface';

export const loadFullConfig: {
  (): BundleConfig;
  readonly filenames: readonly string[];
};
