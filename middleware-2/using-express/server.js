const express = require("express");
const fs = require("fs/promises");
const { getHandler, postHandler, deleteHandler } = require("./methods.js");
const app = express();
const LOG_PATH = "log.txt";
const ROUTE = "/api/tasks";
const PORT = 3000;

// Logger middleware for Express
app.use(async (req, res, next) => {
  const logData = `${new Date().toISOString()}, ${req.method}, ${req.url}\n`;
  try {
    await fs.appendFile(LOG_PATH, logData);
  } catch (err) {
    // Optionally log error, but don't block request
    console.error("Failed to write log:", err);
  }
  next();
});

// Built-in JSON body parser
app.use(express.json());

// Route handlers
app.get(ROUTE, getHandler);
app.post(ROUTE, postHandler);
app.delete(ROUTE, deleteHandler);

// 404 handler for unmatched routes
app.use((req, res) => {
  sendJSON(res, { error: "NOT FOUND" }, 404);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  sendJSON(res, { error: "Internal server error" }, 500);
});

app.listen(PORT, () => {
  console.log(`Express running on ${PORT}`);
});
