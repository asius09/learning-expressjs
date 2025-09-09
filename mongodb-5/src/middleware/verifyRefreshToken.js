const jwt = require("jsonwebtoken");
const tryCatch = require("../utils/tryCatch");
require("dotenv").config();

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const verifyRefreshToken = tryCatch(async (req, res, next) => {
  const refreshToken = req.cookies.refresh;

  if (!refreshToken) {
    console.error("Refresh token is missing in cookies.");
    const error = new Error("Refresh token is required.");
    error.status = 401;
    error.details = ["REFRESH_TOKEN_MISSING"];
    return next(error);
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    req.refresh = decoded;
    console.log("Refresh Token: ", decoded);
    next();
  } catch (err) {
    console.error("Invalid or expired refresh token.", err);
    const error = new Error("Invalid or expired refresh token.");
    error.status = 401;
    error.details = ["REFRESH_TOKEN_INVALID"];
    return next(error);
  }
});

module.exports = verifyRefreshToken;
