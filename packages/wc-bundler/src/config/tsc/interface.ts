import type { CompilerOptions } from 'typescript';
import { detectFile } from '../../utils';

export interface TypeScriptCompileConfig {
  compilerOptions?: CompilerOptions;
  configFilePath?: string | false;
}

export function DefaultTypeScriptCompileConfig(): TypeScriptCompileConfig | false {
  return detectFile('tsconfig.json') ? { configFilePath: 'tsconfig.json' } : false;
}
