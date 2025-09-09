const tryCatch = require("../utils/tryCatch");
const cors = tryCatch((req, res, next) => {
  const reqOrigin = req.headers.origin;
  const allowOrigins = ["http://localhost:3000"];

  if (!reqOrigin) {
    const error = new Error(
      "CORS Error: Origin header is missing from the request."
    );
    error.status = 400;
    error.details = ["ORIGIN_HEADER_MISSING"];
    return next(error);
  }

  const resAllowOrigin = res.getHeader("Access-Control-Allow-Origin");
  if (resAllowOrigin && resAllowOrigin === reqOrigin) {
    return next();
  }

  const isAllowed = allowOrigins.some((origin) => reqOrigin === origin);

  if (!isAllowed) {
    const error = new Error("CORS Error: Origin not allowed");
    error.status = 401;
    return next(error);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

module.exports = cors;
