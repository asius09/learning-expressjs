const users = require("../utils/users.js");
const createResponse = require("../utils/createResponse.js");

// Controller to get all users
async function getUsers(req, res, next) {
  try {
    const allUsers = await users.getUsers();
    res.status(200).json(createResponse({ data: allUsers }));
  } catch (err) {
    next(err);
  }
}

// Controller to create a new user
async function createUser(req, res, next) {
  try {
    const userObj = req.body;
    await users.createUser(userObj);
    res
      .status(201)
      .json(createResponse({ message: "User created successfully" }));
  } catch (err) {
    next(err);
  }
}

// Controller to get a user by ID
async function getUserById(req, res, next) {
  try {
    const userId = req.params.id || req.query.id;
    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      return next(error);
    }
    const user = await users.getUserById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.status(200).json(createResponse({ data: user }));
  } catch (err) {
    next(err);
  }
}

// Controller to delete a user by ID
async function deleteUserById(req, res, next) {
  try {
    const userId = req.params.id || req.query.id;
    if (!userId) {
      const error = new Error("User ID is required");
      error.status = 400;
      return next(error);
    }
    const deleted = await users.deleteUser(userId);
    if (!deleted) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res
      .status(200)
      .json(createResponse({ message: "User deleted successfully" }));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUserById,
};
