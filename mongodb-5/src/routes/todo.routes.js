const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todos.controller");
const validateTodo = require("../middleware/validateTodo");
const verifyUserById = require("../middleware/verifyUserById");

router.use(validateTodo);
router.use(verifyUserById);

router.get("/", getTodos);
router.get("/:id", getTodos);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

router.all("/", (req, res, next) => {
  handleError(`Route ${req.originalUrl} not found`, 404, next);
});

module.exports = router;
