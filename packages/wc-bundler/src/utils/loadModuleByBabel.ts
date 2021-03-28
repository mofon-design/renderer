import { registerBabel } from './registerBabel';

export function loadModuleByBabel(id: string): unknown {
  try {
    registerBabel();
    return require(id);
  } catch {}

  return undefined;
}
