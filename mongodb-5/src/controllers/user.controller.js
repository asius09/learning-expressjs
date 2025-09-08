const User = require("../schema/user.schema");
const tryCatch = require("../utils/tryCatch");
const createToken = require("../utils/createToken");
const createResponse = require("../utils/createResponse");
require("dotenv").config();

exports.handleSignup = tryCatch(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return createResponse(
      {
        status: 500,
        data: null,
        success: false,
        error: { message: "User creation failed" },
        message: "Something went wrong during signup.",
      },
      res
    );
  }

  const token = createToken({
    id: user._id,
    tokenVersion: user.tokenVersion,
  });

  createResponse(
    {
      status: 201,
      data: { id: user._id, email: user.email },
      success: true,
      error: null,
      message: "Signup successful. Welcome!",
      token,
    },
    res
  );
});

exports.handleLogin = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).select("+password");

  if (!foundUser) {
    return createResponse(
      {
        status: 404,
        data: null,
        success: false,
        error: { message: "No user found" },
        message: "No user found with this email. Please sign up.",
      },
      res
    );
  }

  const ok = await foundUser.checkPassword(password);

  if (!ok) {
    return createResponse(
      {
        status: 400,
        data: null,
        success: false,
        error: { message: "Incorrect password" },
        message: "Incorrect password. Please try again.",
      },
      res
    );
  }

  const token = createToken({
    id: foundUser._id,
    tokenVersion: foundUser.tokenVersion,
  });

  createResponse(
    {
      status: 200,
      data: { id: foundUser._id, email: foundUser.email },
      success: true,
      error: null,
      message: "Login successful. Welcome back!",
      token,
    },
    res
  );
});

exports.getUsers = tryCatch(async (req, res, next) => {
  // TODO: show only for admin
  const users = await User.find();
  if (!users) {
    return createResponse(
      {
        status: 404,
        data: null,
        success: false,
        error: { message: "No users found" },
        message: "No users found in the database.",
      },
      res
    );
  }
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
