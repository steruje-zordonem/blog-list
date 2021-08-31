module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  plugins: ['react', 'jest'],
  rules: {
    'no console': 'off',
    'no-alert': 'off',
  },
};
