const path = require("path");
const { GenericContainer } = require("testcontainers");
const cypress = require("cypress");

// ฟังก์ชันสำหรับสร้างและเริ่ม container
async function buildAndStartContainer(servicePath, port) {
  // สร้าง container จาก Dockerfile ที่กำหนด
  const container = await GenericContainer.fromDockerfile(
    path.resolve(__dirname, servicePath)
  ).build();

  // กำหนดพอร์ตที่ต้องการ expose และเริ่ม container
  const runningContainer = await container.withExposedPorts(port).start();
  // ดึงพอร์ตที่ถูกแมปมาใช้
  const mappedPort = runningContainer.getMappedPort(port);
  const baseUrl = `http://localhost:${mappedPort}`;
  console.log(`Service is running on port ${mappedPort}`);

  // คืนค่า container ที่กำลังรันและ baseUrl
  return { runningContainer, baseUrl };
}

// ฟังก์ชันสำหรับรันการทดสอบ Cypress
async function runCypressTests(baseUrl, specPattern, configFile) {
  console.log(`Running Cypress tests for ${baseUrl}...`);
  await cypress.run({
    configFile: configFile,
    config: {
      baseUrl: baseUrl,
      specPattern,
    },
  });
}

// ฟังก์ชันหลักที่ใช้ในการรันทั้งหมด
(async () => {
  try {
    console.log("Building and starting container 1...");
    // สร้างและเริ่ม container สำหรับ service1
    const { runningContainer: runningContainer1, baseUrl: baseUrl1 } =
      await buildAndStartContainer("./service1", 3000);

    // รันการทดสอบ Cypress สำหรับ service1
    await runCypressTests(
      baseUrl1,
      "cypress/integration/service1/*.spec.js",
      "service1.config.js"
    );

    // // หยุด container หลังจากการทดสอบเสร็จสิ้น
    // console.log("Stopping container 1...");
    // await runningContainer1.stop();

    // console.log("Building and starting container 2...");
    // // สร้างและเริ่ม container สำหรับ service2
    // const { runningContainer: runningContainer2, baseUrl: baseUrl2 } =
    //   await buildAndStartContainer("./service2", 4000);

    // // รันการทดสอบ Cypress สำหรับ service2
    // await runCypressTests(baseUrl2, "cypress/integration/service2/*.spec.js");

    // // หยุด container หลังจากการทดสอบเสร็จสิ้น
    // console.log("Stopping container 2...");
    // await runningContainer2.stop();

    console.log("All tests complete. Containers stopped.");
  } catch (error) {
    // จัดการข้อผิดพลาดที่เกิดขึ้น
    console.error("Error occurred:", error);
  }
})();
