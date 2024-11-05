const { GenericContainer } = require("testcontainers");

async function buildAndStartContainer(servicePath, port) {
  const container = await new GenericContainer("postgres")
    .withEnvironment({
      POSTGRES_USER: "postgres",
      POSTGRES_PASSWORD: "123456789",
      POSTGRES_DB: "test_db",
    })
    .withExposedPorts(5432)
    .start();

  const dbHost = container.getHost();
  const dbPort = container.getMappedPort(5432);

  const connectionString = `postgres://postgres:123456789@${dbHost}:${dbPort}/test_db`;

  return { container, connectionString };
}

module.exports = (on, config) => {
  let container;

  console.log("before:run");

  on("before:run", async () => {
    container = await buildAndStartContainer();
    console.log("Container started");
  });

  console.log("after:run");

  on("after:run", async () => {
    if (container) {
      await container.stop();
    }
  });
};
