#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

module.exports = new Promise((resolve, reject) => {
  require('gulp').series(loadCore()())(done);

  function done(error) {
    if (!error) return resolve();
    require('signale').error(error);
    reject(error);
  }
});

function loadCore() {
  try {
    return require('wc-bundler').core;
  } catch {}

  require('signale').info(
    '`wc-bundler` has not been built yet, try to load the uncompiled source code...',
  );
  require('@babel/register')({
    presets: [
      ['@babel/preset-env', { targets: { node: process.version }, modules: 'cjs' }],
      '@babel/preset-typescript',
    ],
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
  });
  return require('wc-bundler/src').core;
}
