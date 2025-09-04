//useMiddleware.js
const { createLogs } = require("../utils/logs");
exports.handleLogs = async (req, res, next) => {
  try {
    await createLogs(req);
  } catch (err) {
    throw new Error(err.message);
  }
};
