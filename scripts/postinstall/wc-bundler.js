module.exports.WCBundler = async function WCBundler() {
  console.log('\nBuild wc-bundler...');

  const cwd = process.cwd();
  process.chdir('./packages/wc-bundler');

  require('@babel/register')({
    extensions: ['.tsx', '.ts', '.jsx', '.mjs', '.es'],
    ignore: [/node_modules/],
    only: [process.cwd()],
    presets: [
      ['@babel/preset-env', { targets: { node: process.version }, modules: 'cjs' }],
      '@babel/preset-typescript',
    ],
  });

  await require('wc-bundler/src').bin();

  process.chdir(cwd);
};
