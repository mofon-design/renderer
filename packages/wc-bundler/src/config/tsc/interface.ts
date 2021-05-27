import type { CompilerOptions, ParsedCommandLine } from 'typescript';
import { detectFile } from '../../utils';

export interface TypeScriptCompileConfig {
  compilerOptions?: CompilerOptions;
  configFilePath?: string;
}

export interface ResolvedTypeScriptCompileConfig extends Partial<ParsedCommandLine> {
  rawCompilerOptions: CompilerOptions;
}

export function DefaultTypeScriptCompileConfig(): TypeScriptCompileConfig | false {
  return detectFile('tsconfig.json') ? { configFilePath: 'tsconfig.json' } : false;
}
