require('@babel/register')({
  presets: [
    ['@babel/preset-env', { targets: { node: process.version }, modules: 'cjs' }],
    '@babel/preset-typescript',
  ],
  extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
});

const { task } = require('gulp');
const { core } = require('./src/core/index');

task('default', core({ babel: { typescript: true }, cjs: true, esm: true }));
