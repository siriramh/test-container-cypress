const path = require("path");
const { GenericContainer } = require("testcontainers");

async function buildAndStartContainer(servicePath, port) {
  const container = await GenericContainer.fromDockerfile(
    path.resolve(__dirname, servicePath)
  ).build();

  const runningContainer = await container.withExposedPorts(port).start();
  const mappedPort = runningContainer.getMappedPort(port);
  const baseUrl = `http://localhost:${mappedPort}`;
  console.log(`Service is running on port ${mappedPort}`);

  return { runningContainer, baseUrl };
}
