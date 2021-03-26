import { version as babelCoreVersion, parseSync as babelParse } from '@babel/core';
import semver from 'semver';
import { version } from '../package.json';
import { normalizeBabelParseConfig, normalizeESLintConfig } from './configuration';
import convert from './convert';
import analyzeScope from './analyze-scope';
import visitorKeys from './visitor-keys';

let isRunningMinSupportedCoreVersion = null;

function baseParse(code, options) {
  // Ensure we're using a version of `@babel/core` that includes `parse()` and `tokTypes`.
  const minSupportedCoreVersion = '>=7.2.0';

  if (typeof isRunningMinSupportedCoreVersion !== 'boolean') {
    isRunningMinSupportedCoreVersion = semver.satisfies(babelCoreVersion, minSupportedCoreVersion);
  }

  if (!isRunningMinSupportedCoreVersion) {
    throw new Error(
      `@babel/eslint-parser@${version} does not support @babel/core@${babelCoreVersion}. Please upgrade to @babel/core@${minSupportedCoreVersion}.`,
    );
  }

  let ast;

  try {
    ast = babelParse(code, normalizeBabelParseConfig(options));
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.lineNumber = err.loc.line;
      err.column = err.loc.column;
    }

    throw err;
  }

  convert(ast, code);

  return ast;
}

export function parse(code, options = {}) {
  return baseParse(code, normalizeESLintConfig(options));
}

export function parseForESLint(code, options = {}) {
  const normalizedOptions = normalizeESLintConfig(options);
  const ast = baseParse(code, normalizedOptions);
  const scopeManager = analyzeScope(ast, normalizedOptions);

  return { ast, scopeManager, visitorKeys };
}
