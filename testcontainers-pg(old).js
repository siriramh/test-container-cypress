// test/service.test.js
const { GenericContainer } = require("testcontainers");
const axios = require("axios");

let postgresContainer;
let backendProcess;

beforeAll(async () => {
  // Start a PostgreSQL container
  postgresContainer = await new GenericContainer("postgres")
    .withEnv("POSTGRES_USER", "postgres")
    .withEnv("POSTGRES_PASSWORD", "password")
    .withEnv("POSTGRES_DB", "cms")
    .withExposedPorts(5432)
    .start();

  const dbHost = postgresContainer.getHost();
  const dbPort = postgresContainer.getMappedPort(5432);

  // Run backend with the PostgreSQL container's info
  process.env.PGHOST = dbHost;
  process.env.PGPORT = dbPort;
  process.env.PGDATABASE = "cms";
  process.env.PGUSER = "postgres";
  process.env.PGPASSWORD = "password";

  // Start the backend server
  backendProcess = require("child_process").fork("./service3/index.js");
});

afterAll(async () => {
  await postgresContainer.stop();
  backendProcess.kill();
});
