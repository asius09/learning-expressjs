const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN;
const SALT_ROUND = parseInt(process.env.SALT_ROUND);
//create schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email Required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    tokenVersion: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre Hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, SALT_ROUND);
  this.passwordChangedAt = new Date();
  next();
});

UserSchema.methods.checkPassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

UserSchema.methods.createRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      id: this._id,
      tokenVersion: this.tokenVersion + 1,
    },
    REFRESH_SECRET,
    { expiresIn: EXPIRY }
  );
  this.tokenVersion += 1;
  this.refreshToken = refreshToken;
  return refreshToken;
};

UserSchema.methods.changePasswordAfter = function (timestamp) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > timestamp;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
