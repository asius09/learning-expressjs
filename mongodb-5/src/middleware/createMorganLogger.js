const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

function createMorganLogger() {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :req[user-agent] :total-time :user-agent",
    {
      stream: fs.createWriteStream(path.join(__dirname, "../../logs/access.log"), {
        flags: "a",
      }),
    }
  );
}

module.exports = createMorganLogger;
