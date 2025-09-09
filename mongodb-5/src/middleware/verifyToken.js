const jwt = require("jsonwebtoken");
const tryCatch = require("../utils/tryCatch");
const User = require("../schema/user.schema");
require("dotenv").config();

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("Invalid or expired refresh token.");
    error.status = 401;
    error.details = ["REFRESH_TOKEN_INVALID"];
    throw error;
  }
  const newRefreshToken = await user.createRefreshToken();
  if (!newRefreshToken) {
    const error = new Error("Failed to create new refresh token.");
    error.status = 500;
    throw error;
  }
  return newRefreshToken;
};

const verifyToken = tryCatch(async (req, res, next) => {
  const token = req.cookies.auth;
  const refreshToken = req.refresh;

  if (!token && !refreshToken) {
    const error = new Error(
      "Authentication token is missing. Please log in to continue."
    );
    error.status = 401;
    error.details = ["TOKEN_MISSING"];
    return next(error);
  }

  if (!token && refreshToken) {
    try {
      req.refreshToken = await generateToken(refreshToken.id);
      return next();
    } catch (err) {
      return next(err);
    }
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        req.refreshToken = await generateToken(refreshToken.id);
        return next();
      } catch (refreshErr) {
        return next(refreshErr);
      }
    }
    const error = new Error(
      "Invalid authentication token. Please log in again."
    );
    error.status = 401;
    error.details = ["TOKEN_INVALID"];
    return next(error);
  }

  if (!decoded) {
    const error = new Error("Failed to authenticate user. Please try again.");
    error.status = 401;
    error.details = { code: "TOKEN_DECODE_FAILED" };
    return next(error);
  }

  req.user = decoded;
  next();
});

module.exports = verifyToken;
