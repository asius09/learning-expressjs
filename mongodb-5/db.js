const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
