const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const data = require("./combinedData.json");
puppeteerExtra.use(AdblockerPlugin());
const app = express();
const port = 3005;

// Create a writable stream for logs
const logStream = fs.createWriteStream("app-logs.txt", { flags: "a" });

// Create an in-memory buffer for logs
const logBuffer = [];

// Redirect console output to the logStream
const originalConsoleLog = console.log;
console.log = function (...args) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message: args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join(" "),
  };
  originalConsoleLog.apply(console, args);
  logStream.write(JSON.stringify(logEntry) + "\n");
  logBuffer.unshift(logEntry);
};

// Middleware to expose logs via an API endpoint
app.use("/logs", (req, res) => {
  res.json({ logs: logBuffer });
});

const data = require("./finalWithSubId.json");
app.get("/data", (req, res) => {
  const contentType = "products"; // Replace with your content type name

  total = 0;
  (async () => {
    for (const cat of data) {
      console.log(cat.sub.length, "length");
      // Replace with your Strapi API URL
      for (const iterator of cat.sub) {
        console.log(iterator.id, "++");
        for (const iter of iterator.data) {
          const { name, link, detail, ...tavledata } = iter;
          // console.log(++total, "++");
          console.log(name, link, { ...tavledata }, "--");

          try {
            const res = await axios.post(`${apiUrl}/api/${contentType}`, {
              data: {
                name: name,
                overview: detail,
                sub_category: iterator.id,
                tabledata: { ...tavledata },
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
      }
    }
    console.log(total, "totall");
  })();
  res.json({ message: "Hello, logging API!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
