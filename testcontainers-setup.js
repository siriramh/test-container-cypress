const { GenericContainer } = require("testcontainers");
const cypress = require("cypress");

(async () => {
  // Spin up the Docker container for the web server
  const container = await new GenericContainer("hello-world-app")
    .withExposedPorts(3000)
    // .withCmd(["node", "server.js"])
    // .withBindMount(__dirname, "/usr/src/app") // Mount the current directory
    .start();

  const port = container.getMappedPort(3000);
  console.log(`Server is running on port ${port}`);

  // Set the base URL for Cypress to the dynamically mapped port
  const baseUrl = `http://localhost:${port}`;

  // Run Cypress tests
  await cypress.run({
    config: {
      baseUrl,
    },
  });

  // Stop the container after tests are complete
  await container.stop();
})();
