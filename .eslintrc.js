const [OFF, ERROR] = [0, 2];

module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'consistent-return': OFF,
    'no-bitwise': OFF,
    'no-continue': OFF,
    'no-nested-ternary': OFF,
    'no-param-reassign': OFF,
    'no-restricted-syntax': OFF,
    'no-unused-expressions': OFF,
    'prefer-destructuring': OFF,
    'import/no-named-as-default': OFF,
    'react/no-unknown-property': OFF,
  },
  settings: {
    react: {
      pragma: 'WC',
    },
  },
  overrides: [
    {
      files: 'scripts/**/*',
      rules: {
        'no-console': OFF,
      },
    },
  ],
};
