import ts from 'typescript';

export const CompilerOptionsEnumMap = {
  importsNotUsedAsValues: {
    [ts.ImportsNotUsedAsValues.Error]: 'error',
    [ts.ImportsNotUsedAsValues.Preserve]: 'preserve',
    [ts.ImportsNotUsedAsValues.Remove]: 'remove',
  },
  jsx: {
    [ts.JsxEmit.None]: 'none',
    [ts.JsxEmit.Preserve]: 'preserve',
    [ts.JsxEmit.React]: 'react',
    [ts.JsxEmit.ReactJSX]: 'react-jsx',
    [ts.JsxEmit.ReactJSXDev]: 'react-jsxdev',
    [ts.JsxEmit.ReactNative]: 'react-native',
  },
  module: {
    [ts.ModuleKind.None]: 'none',
    [ts.ModuleKind.CommonJS]: 'commonjs',
    [ts.ModuleKind.AMD]: 'amd',
    [ts.ModuleKind.UMD]: 'umd',
    [ts.ModuleKind.System]: 'system',
    [ts.ModuleKind.ES2015]: 'es2015',
    [ts.ModuleKind.ES2020]: 'es2020',
    [ts.ModuleKind.ESNext]: 'esnext',
  },
  moduleResolution: {
    [ts.ModuleResolutionKind.Classic]: 'classic',
    [ts.ModuleResolutionKind.NodeJs]: 'node',
  },
  newLine: {
    [ts.NewLineKind.CarriageReturnLineFeed]: 'crlf',
    [ts.NewLineKind.LineFeed]: 'lf',
  },
  target: {
    [ts.ScriptTarget.JSON]: 'json',
    [ts.ScriptTarget.Latest]: 'latest',
    [ts.ScriptTarget.ES3]: 'es3',
    [ts.ScriptTarget.ES5]: 'es5',
    [ts.ScriptTarget.ES2015]: 'es2015',
    [ts.ScriptTarget.ES2016]: 'es2016',
    [ts.ScriptTarget.ES2017]: 'es2017',
    [ts.ScriptTarget.ES2018]: 'es2018',
    [ts.ScriptTarget.ES2019]: 'es2019',
    [ts.ScriptTarget.ES2020]: 'es2020',
    [ts.ScriptTarget.ES2021]: 'es2021',
    [ts.ScriptTarget.ESNext]: 'esnext',
  },
} as const;
