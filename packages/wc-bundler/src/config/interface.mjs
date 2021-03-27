import { env, root } from '../utils';
import type {
  BabelConfig,
  BabelEnvConfig,
  BabelMinifyConfig,
  BabelTypeScriptConfig,
} from './interface';

export const DefaultBabelEnvConfig: BabelEnvConfig = {
  browserslistEnv: undefined,
  bugfixes: true,
  configPath: root,
  debug: env.DEBUG,
  ignoreBrowserslistConfig: true,
  loose: false,
  shippedProposals: false,
  spec: false,
  targets: {
    Edge: '79',
    Firefox: '63',
    Chrome: '54',
    Safari: '10.1',
  },
  useBuiltIns: false,
};

export const DefaultBabelMinifyConfig: BabelMinifyConfig = {
  booleans: true,
  builtIns: true,
  consecutiveAdds: true,
  deadcode: true,
  evaluate: true,
  flipComparisons: true,
  guards: true,
  infinity: true,
  mangle: true,
  memberExpressions: true,
  mergeVars: true,
  numericLiterals: true,
  propertyLiterals: true,
  regexpConstructors: true,
  removeConsole: false,
  removeDebugger: false,
  removeUndefined: true,
  replace: true,
  simplify: true,
  simplifyComparisons: true,
  typeConstructors: true,
  undefinedToVoid: true,
};

export const DefaultBabelTypeScriptConfig: BabelTypeScriptConfig = {
  allExtensions: false,
  allowDeclareFields: true,
  allowNamespaces: true,
  jsxPragma: 'WC',
  jsxPragmaFrag: 'WC.Fragment',
  isTSX: false,
  onlyRemoveTypeImports: false,
};

export const DefaultBabelConfig: BabelConfig = {
  env: DefaultBabelEnvConfig,
  typescript: DefaultBabelTypeScriptConfig,
};
