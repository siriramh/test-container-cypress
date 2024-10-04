const { GenericContainer } = require("testcontainers");
const cypress = require("cypress");
const path = require("path");

(async () => {
  try {
    console.log("Building and starting container 1...");

    // 1. Build and start container 1
    const container1 = await GenericContainer.fromDockerfile(
      path.resolve(__dirname, "./service1")
    ) // Dockerfile path
      .build();

    const runningContainer1 = await container1
      .withExposedPorts(3000) // Set the exposed port
      .start();

    const port1 = runningContainer1.getMappedPort(3000);
    const baseUrl1 = `http://localhost:${port1}`;
    console.log(`Service 1 is running on port ${port1}`);

    // 2. Run Cypress tests for service 1
    console.log("Running Cypress tests for service 1...");
    await cypress.run({
      config: {
        baseUrl: baseUrl1,
      },
    });

    console.log("Stopping container 1...");
    await runningContainer1.stop();

    console.log("Building and starting container 2...");

    // 3. Build and start container 2
    const container2 = await GenericContainer.fromDockerfile(
      path.resolve(__dirname, "./service2")
    ) // Dockerfile path
      .build();

    const runningContainer2 = await container2
      .withExposedPorts(4000) // Set the exposed port
      .start();

    const port2 = runningContainer2.getMappedPort(4000);
    const baseUrl2 = `http://localhost:${port2}`;
    console.log(`Service 2 is running on port ${port2}`);

    // 4. Run Cypress tests for service 2
    console.log("Running Cypress tests for service 2...");
    await cypress.run({
      config: {
        baseUrl: baseUrl2,
      },
    });

    console.log("Stopping container 2...");
    await runningContainer2.stop();

    console.log("All tests complete. Containers stopped.");
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
