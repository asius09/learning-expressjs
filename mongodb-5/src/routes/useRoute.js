const express = require("express");
const router = express.Router();
const TODO_ROUTE = "/todos";
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.get("/", (req, res, next) => {}); //get
router.post("/"); //get
router.delete("/:id"); //get
router.put("/:id");
