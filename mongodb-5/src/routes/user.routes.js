const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleSignup,
  getUsers,
  handleLogOut,
} = require("../controllers/user.controller");
const validateUser = require("../middleware/validateUser");
const verifyToken = require("../middleware/verifyToken");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");

router.post("/logout/:id", verifyToken, handleLogOut);
router.use(validateUser);
router.post("/signup", handleSignup);
router.post("/login", handleLogin);

router.get("/", verifyToken, getUsers);

router.all("/", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

module.exports = router;
