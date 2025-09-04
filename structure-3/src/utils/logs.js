//logs.js
const fs = require("fs/promises");
const path = require("path");
const PATH = path.join(__dirname, "../log.txt");

exports.createLogs = async (req) => {
  try {
    const url = req.url;
    const method = req.method;
    const now = new Date().toISOString();
    await fs.appendFile(PATH, `${now}, ${method}, ${url}\n`);
  } catch (err) {
    throw new Error("CREATE LOG ERROR", err.message);
  }
};
