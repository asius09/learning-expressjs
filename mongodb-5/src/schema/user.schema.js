const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUND = 10;
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

UserSchema.methods.changePasswordAfter = function (timestamp) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > timestamp;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
