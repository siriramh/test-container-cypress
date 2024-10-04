const { GenericContainer } = require("testcontainers");
const cypress = require("cypress");
const path = require("path");

(async () => {
  try {
    // 1. Build the Docker Image from Dockerfile
    console.log("Building Docker image from Dockerfile...");
    const container = await GenericContainer.fromDockerfile(
      path.resolve(__dirname)
    ) // Path to Dockerfile in the current directory
      .build();

    // 2. Start the container
    console.log("Starting container...");
    const runningContainer = await container.withExposedPorts(3000).start();

    const port = runningContainer.getMappedPort(3000);
    console.log(`Server is running on port ${port}`);

    // Set base URL for Cypress
    const baseUrl = `http://localhost:${port}`;

    // 3. Run Cypress tests
    console.log("Running Cypress tests...");
    await cypress.run({
      config: {
        baseUrl,
      },
    });

    // 4. Stop the container after tests
    console.log("Stopping container...");
    await runningContainer.stop();

    console.log("Test complete. Container stopped.");
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
