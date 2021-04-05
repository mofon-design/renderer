const { WCBundler } = require('./wc-bundler');
const { yorkie } = require('./yorkie');

(async () => {
  await yorkie();
  await WCBundler();
})();
