const fs = require("fs/promises");
const path = require("path");
const { parseUserLine, parseUserObj } = require("./parse");
const PATH = path.join(__dirname, "../user.txt");

exports.getUsers = async () => {
  try {
    const data = await fs.readFile(PATH, "utf8");
    if (!data.trim()) {
      // No users present
      return [];
    }
    // Split lines, filter out empty/whitespace lines, parse each line
    const users = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map(parseUserLine)
      .filter((user) => user !== null);
    return users;
  } catch (err) {
    // Don't reference res here; let the caller handle errors
    throw new Error(`[GET USERS]: Failed to fetch users: ${err.message}`);
  }
};

exports.createUser = async (userObj) => {
  try {
    // Ensure all required fields except id are present
    if (!userObj || !userObj.name || !userObj.email) {
      throw new Error("Missing required user fields (name, email)");
    }

    // Generate a unique id (simple timestamp + random for demo purposes)
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const userToSave = { ...userObj, id: uniqueId };

    // Append with newline for proper formatting
    await fs.appendFile(PATH, parseUserObj(userToSave));
    return userToSave;
  } catch (err) {
    throw new Error(`[CREATE USERS]: Failed to create users: ${err.message}`);
  }
};

exports.getUserById = async (userId) => {
  try {
    const users = await exports.getUsers();
    const foundUser = users.find((user) => user.id === userId);
    return foundUser || null;
  } catch (err) {
    throw new Error(`[GET USER BY ID]: Failed to fetch user: ${err.message}`);
  }
};

exports.deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required for deletion");
    }
    const users = await exports.getUsers();
    const filteredUsers = users.filter((user) => user.id !== userId);

    if (filteredUsers.length === users.length) {
      // No user was deleted (user not found)
      return false;
    }

    // Write the filtered users back to the file
    const dataToWrite = filteredUsers.map(parseUserObj).join("");
    await fs.writeFile(PATH, dataToWrite, "utf8");
    return true;
  } catch (err) {
    throw new Error(`[DELETE USER]: Failed to delete user: ${err.message}`);
  }
};
