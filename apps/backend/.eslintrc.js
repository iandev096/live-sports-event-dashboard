module.exports = {
  extends: ["@repo/eslint-config/node"],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  env: {
    node: true,
    es2023: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
};
