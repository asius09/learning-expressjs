const User = require("../schema/user.schema");
const tryCatch = require("../utils/tryCatch");
const createToken = require("../utils/createToken");
const createResponse = require("../utils/createResponse");
const handleError = require("../utils/handleError");
require("dotenv").config();

const checkIsAdmin = async (userId, next) => {
  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return handleError("No users found in the database.", 404, next);
  }

  return foundUser.role === "admin";
};

exports.handleSignup = tryCatch(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return handleError("User creation failed", 500, next);
  }

  const refreshToken = user.createRefreshToken();
  const token = createToken({
    id: user._id,
    tokenVersion: user.tokenVersion + 1,
  });

  createResponse(
    {
      status: 201,
      data: { id: user._id, email: user.email, role: user.role },
      success: true,
      error: null,
      message: "Signup successful. You are now logged in!",
      token,
      refreshToken,
    },
    res
  );
});

exports.handleLogin = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).select("+password");

  if (!foundUser) {
    return handleError(
      "No user found with this email. Please sign up.",
      404,
      next
    );
  }

  const ok = await foundUser.checkPassword(password);

  if (!ok) {
    return handleError("Incorrect password. Please try again.", 400, next);
  }

  const refreshToken = foundUser.createRefreshToken();

  const token = createToken({
    id: foundUser._id,
    tokenVersion: foundUser.tokenVersion + 1,
  });

  createResponse(
    {
      status: 200,
      data: { id: foundUser._id, email: foundUser.email, role: foundUser.role },
      success: true,
      error: null,
      message: "Login successful. Welcome back!",
      token,
      refreshToken,
    },
    res
  );
});

exports.handleLogOut = tryCatch(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return handleError("Invalid Request! User Id is required", 400, next);
  }

  const user = await User.findById(userId);

  if (!user) {
    return handleError("User not found", 400, next);
  }

  // Invalidate the user's refresh token by setting it to null and incrementing tokenVersion
  user.refreshToken = null;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  createResponse(
    {
      status: 200,
      data: null,
      success: true,
      error: null,
      message: "Logged out successfully.",
      clearCookies: true,
    },
    res
  );
});

exports.getUsers = tryCatch(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return handleError("Invalid Request! User Id is required", 400, next);
  }

  const isAdmin = await checkIsAdmin(userId, next);

  if (!isAdmin) {
    return handleError("Unauthorized Request", 401, next);
  }

  const users = await User.find();

  createResponse(
    {
      status: 200,
      data: users,
      success: true,
      error: null,
      message: "Fetched all users successfully.",
    },
    res
  );
});
