module.exports = {
  extends: [
    'prettier',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
    commonjs: true,
  },
  plugins: ['jest', 'node'],
  rules: {
    'no-const-assign': 'error',
    eqeqeq: 'error',
    strict: 'error',
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'eslint-config-hapi': 0,
    'no-const-assign': 'error',
    'no-unused-vars': [2, { vars: 'all', args: 'none' }],
    'import/order': 'error',
    'no-console': 'error',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
}
