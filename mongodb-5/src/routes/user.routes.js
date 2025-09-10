const express = require("express");
const router = express.Router();
const {
  getUsers,
  handleLogin,
  handleSignup,
  handleLogOut,
} = require("../controllers/user.controller");
const validateUser = require("../middleware/validateUser");
const verifyToken = require("../middleware/verifyToken");
const handleError = require("../utils/handleError");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");

router.post("/logout/:id", verifyRefreshToken, verifyToken, handleLogOut);

router.use(validateUser);
router.post("/signup", handleSignup);
router.post("/login", handleLogin);

router.get("/", verifyToken, getUsers);

router.all("/", (req, res, next) => {
  handleError(`Route ${req.originalUrl} not found`, 404, next);
});

module.exports = router;
