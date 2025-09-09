const rateLimit = require("express-rate-limit");
const createResponse = require("../utils/createResponse");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res, next) => {
    createResponse(
      {
        status: 429,
        error: "Too many requests, Please try again later.",
        message: "Too many requests, Please try again later.",
        success: false,
      },
      res
    );
  },
});

module.exports = limiter;
