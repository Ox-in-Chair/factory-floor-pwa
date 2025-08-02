module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: "detect" }
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    // temporary relaxations to get you back on track; tighten later per PR
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/exhaustive-deps": "warn",
    // enforce Poppins color text etc. could be added separately if desired
  }
};
