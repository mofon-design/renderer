module.exports.WCBundler = async function WCBundler() {
  console.log('\nBuild wc-bundler...');

  const fs = require('fs');
  const cwd = process.cwd();
  process.chdir('./packages/wc-bundler');
  const TSConfigJSONExsists = fs.existsSync('tsconfig.json');
  if (!TSConfigJSONExsists) fs.writeFileSync('tsconfig.json', '{}', 'utf8');
  await require('wc-bundler/bin/index');
  if (!TSConfigJSONExsists) fs.unlinkSync('tsconfig.json');
  process.chdir(cwd);
};
