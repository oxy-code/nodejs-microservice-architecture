/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};

module.exports = config;
