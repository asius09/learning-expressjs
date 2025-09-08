const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleSignup,
  getUsers,
} = require("../controllers/user.controller");
const validateUser = require("../middleware/validateUser");

router.get("/", getUsers);
router.use(validateUser);

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.all("/", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

module.exports = router;
