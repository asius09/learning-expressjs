const createResponse = require("../utils/createResponse");

/**
 * Centralized error handling middleware for Express.
 * Uses createResponse to send error details.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  createResponse(
    {
      status,
      data: null,
      success: false,
      error: err.message || "Internal Server Error",
      message: err.message || "Something went wrong.",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    res
  );
}

module.exports = errorHandler;

