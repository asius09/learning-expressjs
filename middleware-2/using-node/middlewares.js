// middlewares.js
const LOG_PATH = "log.txt";
const fs = require("fs/promises");

//simple middleware to log into the log.txt
async function loggerMiddleware(req, res, next) {
  const logData = `${new Date()}, ${req.method}, ${req.url}\n`;
  await fs.appendFile(LOG_PATH, logData);
  await next();
}

function parseBodyMiddleware(req, res, next) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    if (!body) {
      req.body = {};
      return next();
    }
    try {
      req.body = JSON.parse(body);
      await next();
    } catch (e) {
      console.error("Failed to parse request body:", e.message);
      // Optionally, you can send an error response if you want to stop the chain
      if (res && typeof res.writeHead === "function") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
      } else {
        req.body = {};
        await next();
      }
    }
  });
  req.on("error", (err) => {
    console.error("Error receiving request body:", err);
    if (res && typeof res.writeHead === "function") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error receiving request body" }));
    }
  });
}

module.exports = {
  loggerMiddleware,
  parseBodyMiddleware,
};
