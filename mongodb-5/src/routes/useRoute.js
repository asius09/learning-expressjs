const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { validate } = require("../middleware/validate");
router.use(validate);
router.get("/", getTodos); //get
router.post("/", createTodo); //get
router.delete("/:id", deleteTodo); //get
router.put("/:id", updateTodo);

module.exports = router;
