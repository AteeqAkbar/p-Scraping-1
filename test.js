// const contentType = "categories";
const apiUrl = "https://cms.tripmerchantjourneys.com";
// const apiUrl = "http://127.0.0.1:1337";

const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// const data = require("./combinedData.json");
puppeteerExtra.use(AdblockerPlugin());
const app = express();
const port = 3005;

const logStream = fs.createWriteStream("app-logs.txt", { flags: "a" });

// Create an in-memory buffer for logs
const logBuffer = [];

// Redirect console output to the logStream
const originalConsoleLog = console.log;
console.log = function (...args) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message: args
      .map((arg) => (typeof arg === "object" ? JSON?.stringify(arg) : arg))
      .join(" "),
  };
  originalConsoleLog.apply(console, args);
  logStream.write(JSON.stringify(logEntry) + "\n");
  logBuffer.unshift(logEntry);
};

//Middleware to expose logs via an API endpoint
app.use("/logs", (req, res) => {
  res.json({ logs: logBuffer });
});

app.get("/data", (req, res) => {
  const contentType = "categories"; // Replace with your content type name
  total = 0;
  (async () => {
    const res = await axios.get(
      `https://backend.tripmerchantjourneys.com/api/member/uuids?merged=1`
    );
    const data2222 = res?.data?.data;
    // console.log(res?.data?.data);
    for (const cat of data2222) {
      try {
        const res = await axios.post(`${apiUrl}/api/${contentType}`, {
          data: {
            name: cat?.title,
            // name: cat?.name,
            uid: cat?.uuid,
          },
        });
        // iterator.id = await res?.data?.data?.id;
        console.log(
          "New product created:",
          await res.res?.data?.data?.id,
          "="
          // iterator.subcat.name
        );
      } catch (error) {
        console.log(error);
      }
    }
    console.log(total, "totall");
  })();
  res.json({ message: "Hello, logging API!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
