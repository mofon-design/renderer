module.exports = {
  endOfLine: 'lf',
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['./packages/prettier-plugin-babel/src/index.js'],
  overrides: [{ files: '**/*.{js,mjs,ts,tsx}', options: { parser: 'babel-es' } }],
};
