import type * as chalk from 'chalk';

type ChalkColors = {
  [Key in keyof chalk.Chalk]: chalk.Chalk[Key] extends chalk.Chalk ? Key : never;
}[keyof chalk.Chalk];

const AvailableColors: ChalkColors[] = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
];

export function allocateColor(token: string): ChalkColors {
  if (allocateColor.allocatedMap[token] === undefined) {
    const color = allocateColor.availableColors.shift()!;
    allocateColor.availableColors.push(color);
    allocateColor.allocatedMap[token] = color;
  }

  return allocateColor.allocatedMap[token];
}

allocateColor.availableColors = AvailableColors;
allocateColor.allocatedMap = Object.create(null) as Record<string, ChalkColors>;
