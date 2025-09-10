module.exports = {
  extends: ["./index.js"],
  env: {
    node: true,
    es2023: true,
  },
  rules: {
    // Node.js specific rules
    "no-console": "off", // Console is acceptable in Node.js
    "no-process-exit": "error",
    "no-sync": "warn", // Warn about synchronous methods

    // Security rules for backend
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",

    // Performance rules
    "no-await-in-loop": "warn",
    "require-atomic-updates": "error",

    // Error handling
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",
  },
};
