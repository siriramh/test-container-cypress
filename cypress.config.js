const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // specPattern: "/integration/*.spec.js",
    specPattern: "cypress/integration/*.js",
  },
});
