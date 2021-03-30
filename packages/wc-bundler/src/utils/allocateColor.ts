import type { Chalk } from 'chalk';

type ChalkColors = {
  [Key in keyof Chalk]: Chalk[Key] extends Chalk ? Key : never;
}[keyof Chalk];

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
  let color = allocateColor.allocatedMap.get(token);

  if (color === undefined) {
    if (allocateColor.allocatedMap.size > allocateColor.maxsize) {
      allocateColor.allocatedMap.forEach((_value, key) => {
        if (Math.random() > 0.8) allocateColor.allocatedMap.delete(key);
      });
    }

    color = allocateColor.availableColors.shift() ?? AvailableColors[0];
    allocateColor.availableColors.push(color);
    allocateColor.allocatedMap.set(token, color);
  }

  return color;
}

allocateColor.availableColors = AvailableColors;
allocateColor.allocatedMap = new Map<string, ChalkColors>(null);
allocateColor.maxsize = 1000 * 1000;
