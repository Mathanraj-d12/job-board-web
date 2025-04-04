/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    commonjs: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "commonjs"
  },
  extends: [
    "eslint:recommended"
  ],
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "quotes": ["error", "double", { "allowTemplateLiterals": true }]
  }
};
