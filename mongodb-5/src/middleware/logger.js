const fs = require("fs/promises");
const path = require("path");

const LOG_PATH = path.join(__dirname, "../../logs/log.log");
// Logger Function
async function logger(req, res, next) {
  const method = req.method;
  let message;
  if (method === "GET") {
    message = "All Todos";
  } else if (method === "POST" || method === "PUT") {
    message = JSON.stringify(req.body);
  } else if (req.params && req.params.id) {
    message = req.params.id;
  } else {
    message = "";
  }
  await fs.appendFile(LOG_PATH, `${(req, method)}, ${req.url}, ${message}\n`);
  next();
}

module.exports = logger;
