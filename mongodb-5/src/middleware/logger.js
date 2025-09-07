const fs = require("fs/promises");
const path = require("path");
const LOG_PATH = path.join(__dirname, "../log.txt");
// Logger Function
exports.logger = async (req, res, next) => {
  const method = req.method;
  let message =
    method === "GET"
      ? "All Todos"
      : method === "POST" || method === "PUT"
      ? req.body
      : req.params.id;
  await fs.appendFile(LOG_PATH, `${(req, method)}, ${req.url}, ${message}\n`);
  next();
};
