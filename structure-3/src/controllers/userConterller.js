const users = require("../utils/users.js");
const createResponse = require("../utils/createResponse.js");

// Controller to get all users
async function getUsers(req, res) {
  try {
    const allUsers = await users.getUsers();
    res.status(200).json(createResponse({ data: allUsers }));
  } catch (err) {
    res
      .status(500)
      .json(createResponse({ success: false, error: err.message }));
  }
}

// Controller to create a new user
async function createUser(req, res) {
  try {
    const userObj = req.body;
    await users.createUser(userObj);
    res
      .status(201)
      .json(createResponse({ message: "User created successfully" }));
  } catch (err) {
    res
      .status(400)
      .json(createResponse({ success: false, error: err.message }));
  }
}

// Controller to get a user by ID
async function getUserById(req, res) {
  try {
    console.log("[GET USER BY ID]", req.params, req.query);
    const userId = req.params.id || req.query.id;
    if (!userId) {
      return res
        .status(400)
        .json(createResponse({ success: false, error: "User ID is required" }));
    }
    const user = await users.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json(createResponse({ success: false, error: "User not found" }));
    }
    res.status(200).json(createResponse({ data: user }));
  } catch (err) {
    res
      .status(500)
      .json(createResponse({ success: false, error: err.message }));
  }
}

// Controller to delete a user by ID
async function deleteUserById(req, res) {
  try {
    const userId = req.params.id || req.query.id;
    if (!userId) {
      return res
        .status(400)
        .json(createResponse({ success: false, error: "User ID is required" }));
    }
    const deleted = await users.deleteUser(userId);
    if (!deleted) {
      return res
        .status(404)
        .json(createResponse({ success: false, error: "User not found" }));
    }
    res
      .status(200)
      .json(createResponse({ message: "User deleted successfully" }));
  } catch (err) {
    res
      .status(500)
      .json(createResponse({ success: false, error: err.message }));
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  deleteUserById,
};
