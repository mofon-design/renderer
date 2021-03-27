import type { Chalk } from 'chalk';

export type ChalkColors = {
  [Key in keyof Chalk]: Chalk[Key] extends Chalk ? Key : never;
}[keyof Chalk];

export const allocateColor: {
  (token: string): ChalkColors;
  readonly availableColors: readonly ChalkColors[];
  readonly allocatedMap: Record<string, ChalkColors>;
};
