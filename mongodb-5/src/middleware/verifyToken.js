const jwt = require("jsonwebtoken");
const tryCatch = require("../utils/tryCatch");
require("dotenv").config();

const verifyToken = tryCatch(async (req, res, next) => {
  const token = req.cookies.auth;

  if (!token) {
    const error = new Error(
      "Authentication token is missing. Please log in to continue."
    );
    error.status = 401;
    error.details = { code: "TOKEN_MISSING" };
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error(
      err.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Invalid authentication token. Please log in again."
    );
    error.status = 401;
    error.details = {
      code:
        err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
      ...(err.expiredAt ? { expiredAt: err.expiredAt } : {}),
    };
    throw error;
  }

  if (!decoded) {
    const error = new Error("Failed to authenticate user. Please try again.");
    error.status = 401;
    error.details = { code: "TOKEN_DECODE_FAILED" };
    throw error;
  }

  req.user = decoded;
  next();
});

module.exports = verifyToken;
