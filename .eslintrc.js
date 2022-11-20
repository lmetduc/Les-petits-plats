module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-continue': 0,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
  },
};
