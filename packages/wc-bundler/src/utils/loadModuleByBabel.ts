import interopRequireDefault from '@babel/runtime/helpers/interopRequireDefault';
import { registerBabel } from './registerBabel';

export function resolveModuleByBabel(id: string): string | undefined {
  try {
    registerBabel();
    return require.resolve(id);
  } catch {}

  return undefined;
}

export function loadModuleByBabel(id: string, interopRequire = true): unknown {
  try {
    registerBabel();
    const content = require(id);
    return interopRequire ? interopRequireDefault(content) : content;
  } catch {}

  return undefined;
}

loadModuleByBabel.resolve = resolveModuleByBabel;
