const jwt = require("jsonwebtoken");
require("dotenv").config();

function createToken(obj) {
  const token = jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}


module.exports = createToken;
