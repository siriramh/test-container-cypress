const { GenericContainer } = require("testcontainers");
const cypress = require("cypress");
const path = require("path");

(async () => {
  let runningContainer1, runningContainer2;

  try {
    console.log("Building and starting multiple containers in parallel...");

    // Build and start containers in parallel
    [runningContainer1, runningContainer2] = await Promise.all([
      GenericContainer.fromDockerfile(path.resolve(__dirname, "./service1"))
        .build()
        .then((container) => container.withExposedPorts(3000).start()),

      GenericContainer.fromDockerfile(path.resolve(__dirname, "./service2"))
        .build()
        .then((container) => container.withExposedPorts(4000).start()),
    ]);

    const port1 = runningContainer1.getMappedPort(3000);
    const port2 = runningContainer2.getMappedPort(4000);

    console.log(`Service 1 is running on port ${port1}`);
    console.log(`Service 2 is running on port ${port2}`);

    // Set base URLs for Cypress tests
    const baseUrl1 = `http://localhost:${port1}`;
    const baseUrl2 = `http://localhost:${port2}`;

    // Run Cypress tests in parallel
    console.log("Running Cypress tests for both services in parallel...");
    await Promise.all([
      cypress.run({
        config: {
          baseUrl: baseUrl1,
          specPattern: "cypress/integration/service1/*.spec.js",
        },
      }),
      cypress.run({
        config: {
          baseUrl: baseUrl2,
          specPattern: "cypress/integration/service2/*.spec.js",
        },
      }),
    ]);

    console.log("All tests complete.");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Ensure containers are stopped
    console.log("Stopping both containers...");
    await Promise.all([runningContainer1?.stop(), runningContainer2?.stop()]);
    console.log("Containers stopped.");
  }
})();
