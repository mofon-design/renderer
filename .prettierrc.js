module.exports = {
  endOfLine: 'lf',
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '**/*.{js,mjs,ts,tsx}',
      options: { parser: require('babel-prettier-parser/src/index.js') },
    },
  ],
};
