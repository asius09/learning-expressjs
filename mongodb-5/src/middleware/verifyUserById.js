const User = require("../schema/user.schema");
const tryCatch = require("../utils/tryCatch");

const verifyUserById = tryCatch(async (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id) {
    const error = new Error("User ID is missing in the request body.");
    error.status = 400;
    error.details = { code: "USER_ID_MISSING" };
    return next(error);
  }

  const user = await User.findById(user_id);

  if (!user) {
    const error = new Error("No user found with the provided User ID.");
    error.status = 404;
    error.details = ["USER_NOT_FOUND"];
    return next(error);
  }

  next();
});

module.exports = verifyUserById;
