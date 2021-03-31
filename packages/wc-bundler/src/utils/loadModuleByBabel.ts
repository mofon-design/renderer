import { registerBabel } from './registerBabel';

export function resolveModuleByBabel(id: string): string | undefined {
  try {
    registerBabel();
    return require.resolve(id);
  } catch {}

  return undefined;
}

export function loadModuleByBabel(id: string): unknown {
  try {
    registerBabel();
    return require(id);
  } catch {}

  return undefined;
}

loadModuleByBabel.resolve = resolveModuleByBabel;
