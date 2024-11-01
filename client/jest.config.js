module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['jest-fetch-mock'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
    },
  };
  