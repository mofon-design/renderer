/* eslint-disable import/no-extraneous-dependencies */

module.exports = new Promise((resolve, reject) => {
  const ret = loadCore()()(done);

  if (!ret || typeof ret !== 'object') return;

  if (typeof ret.then === 'function') {
    ret.then(resolve, reject);
  } else if (typeof ret.once === 'function') {
    ret.once('error', reject);
    ret.once('end', resolve);
  } else if (typeof ret.subscribe === 'function') {
    ret.subscribe(resolve, reject);
  }

  function done(error) {
    error ? reject(error) : resolve();
  }
}).catch((error) => {
  require('signale').error(error);
  if (!process.exitCode) process.exitCode = 1;
});

function loadCore() {
  try {
    return require('wc-bundler').core;
  } catch {}

  require('signale').info(
    '`wc-bundler` has not been built yet, try to load the uncompiled source code...',
  );
  registerBabelForSource();
  return require('wc-bundler/src').core;
}

function registerBabelForSource() {
  require('@babel/register')({
    presets: [
      ['@babel/preset-env', { targets: { node: process.version }, modules: 'cjs' }],
      '@babel/preset-typescript',
    ],
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
  });
}
