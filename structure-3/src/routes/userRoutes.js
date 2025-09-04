const express = require("express");
const router = express.Router();
const userController = require("../controllers/userConterller");
const ROUTE = "/";
// Handle GET /users and GET /users?id=... in one route
router.get(ROUTE, (req, res, next) => {
  const userId = req.query.id || req.params.id;
  if (userId) {
    return userController.getUserById(req, res, next);
  }
  return userController.getUsers(req, res, next);
});

router.post(ROUTE, (req, res, next) =>
  userController.createUser(req, res, next)
);
router.delete(ROUTE, (req, res, next) =>
  userController.deleteUserById(req, res, next)
);

module.exports = router;
