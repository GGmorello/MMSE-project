module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard-with-typescript"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: ["react"],
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/quotes": ["error", "double"],
    "comma-dangle": ["error", "never"],
    "@typescript-eslint/comma-dangle": ["error", "never"],
    semi: ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],
  },
};
