import type { ParsedCommandLine } from 'typescript';
import { detectFile } from '../../utils';
import {
  ImportsNotUsedAsValues,
  ModuleResolutionKind,
  NewLineKind,
} from './compiler-options-enum-map';

export interface TypeScriptCompilerOptions {
  allowJs?: boolean;
  allowSyntheticDefaultImports?: boolean;
  allowUmdGlobalAccess?: boolean;
  allowUnreachableCode?: boolean;
  allowUnusedLabels?: boolean;
  alwaysStrict?: boolean;
  charset?: string;
  disableSizeLimit?: boolean;
  disableSourceOfProjectReferenceRedirect?: boolean;
  disableSolutionSearching?: boolean;
  disableReferencedProjectLoad?: boolean;
  downlevelIteration?: boolean;
  emitBOM?: boolean;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  forceConsistentCasingInFileNames?: boolean;
  importHelpers?: boolean;
  importsNotUsedAsValues?: ImportsNotUsedAsValues;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;
  isolatedModules?: boolean;
  keyofStringsOnly?: boolean;
  lib?: string[];
  locale?: string;
  mapRoot?: string;
  maxNodeModuleJsDepth?: number;
  moduleResolution?: ModuleResolutionKind;
  newLine?: NewLineKind;
  noEmitHelpers?: boolean;
  noErrorTruncation?: boolean;
  noFallthroughCasesInSwitch?: boolean;
  noImplicitAny?: boolean;
  noImplicitReturns?: boolean;
  noImplicitThis?: boolean;
  noStrictGenericChecks?: boolean;
  noUnusedLocals?: boolean;
  noUnusedParameters?: boolean;
  noImplicitUseStrict?: boolean;
  noPropertyAccessFromIndexSignature?: boolean;
  assumeChangesOnlyAffectDirectDependencies?: boolean;
  noLib?: boolean;
  noResolve?: boolean;
  noUncheckedIndexedAccess?: boolean;
  paths?: Record<string, string[]>;
  preserveConstEnums?: boolean;
  noImplicitOverride?: boolean;
  preserveSymlinks?: boolean;
  project?: string;
  reactNamespace?: string;
  composite?: boolean;
  tsBuildInfoFile?: string;
  removeComments?: boolean;
  rootDir?: string;
  rootDirs?: string[];
  skipLibCheck?: boolean;
  skipDefaultLibCheck?: boolean;
  strict?: boolean;
  strictFunctionTypes?: boolean;
  strictBindCallApply?: boolean;
  strictNullChecks?: boolean;
  strictPropertyInitialization?: boolean;
  stripInternal?: boolean;
  suppressExcessPropertyErrors?: boolean;
  suppressImplicitAnyIndexErrors?: boolean;
  traceResolution?: boolean;
  resolveJsonModule?: boolean;
  types?: string[];
  typeRoots?: string[];
  esModuleInterop?: boolean;
  useDefineForClassFields?: boolean;
}

export const AllowedCompilerOptions: Record<keyof TypeScriptCompilerOptions, 1> = {
  allowJs: 1,
  allowSyntheticDefaultImports: 1,
  allowUmdGlobalAccess: 1,
  allowUnreachableCode: 1,
  allowUnusedLabels: 1,
  alwaysStrict: 1,
  charset: 1,
  disableSizeLimit: 1,
  disableSourceOfProjectReferenceRedirect: 1,
  disableSolutionSearching: 1,
  disableReferencedProjectLoad: 1,
  downlevelIteration: 1,
  emitBOM: 1,
  emitDecoratorMetadata: 1,
  experimentalDecorators: 1,
  forceConsistentCasingInFileNames: 1,
  importHelpers: 1,
  importsNotUsedAsValues: 1,
  inlineSourceMap: 1,
  inlineSources: 1,
  isolatedModules: 1,
  keyofStringsOnly: 1,
  lib: 1,
  locale: 1,
  mapRoot: 1,
  maxNodeModuleJsDepth: 1,
  moduleResolution: 1,
  newLine: 1,
  noEmitHelpers: 1,
  noErrorTruncation: 1,
  noFallthroughCasesInSwitch: 1,
  noImplicitAny: 1,
  noImplicitReturns: 1,
  noImplicitThis: 1,
  noStrictGenericChecks: 1,
  noUnusedLocals: 1,
  noUnusedParameters: 1,
  noImplicitUseStrict: 1,
  noPropertyAccessFromIndexSignature: 1,
  assumeChangesOnlyAffectDirectDependencies: 1,
  noLib: 1,
  noResolve: 1,
  noUncheckedIndexedAccess: 1,
  paths: 1,
  preserveConstEnums: 1,
  noImplicitOverride: 1,
  preserveSymlinks: 1,
  project: 1,
  reactNamespace: 1,
  composite: 1,
  tsBuildInfoFile: 1,
  removeComments: 1,
  rootDir: 1,
  rootDirs: 1,
  skipLibCheck: 1,
  skipDefaultLibCheck: 1,
  strict: 1,
  strictFunctionTypes: 1,
  strictBindCallApply: 1,
  strictNullChecks: 1,
  strictPropertyInitialization: 1,
  stripInternal: 1,
  suppressExcessPropertyErrors: 1,
  suppressImplicitAnyIndexErrors: 1,
  traceResolution: 1,
  resolveJsonModule: 1,
  types: 1,
  typeRoots: 1,
  esModuleInterop: 1,
  useDefineForClassFields: 1,
};

export interface TypeScriptCompileConfig {
  compilerOptions?: TypeScriptCompilerOptions;
  configFilePath?: string;
}

export interface ResolvedTypeScriptCompileConfig {
  loaded: TypeScriptCompilerOptions;
  parsed: Partial<ParsedCommandLine>;
}

export function DefaultTypeScriptCompileConfig(): TypeScriptCompileConfig | false {
  return detectFile('tsconfig.json') ? { configFilePath: 'tsconfig.json' } : false;
}
