import { tryCatch } from "../utils/tryCatch";
exports.getTodos = async (req, res, next) => {
  const todoId = req.params.id;
  let response = [];
  if (todoId) {
    // GET todo by id
  } else {
    // get all todo
    const todos = await tryCatch(fetchTodos);
  }
  next();
};

exports.createTodo = async (req, res, next) => {
  const { title, completed, createAt } = req.body;
  next();
};
exports.updateTodo = async (req, res, next) => {
  const todoId = req.params.id;
  if (!todoId) next("Invalid Request! TODO ID is Required");
  // TODO: handle update
  next();
};
exports.deleteTodo = async (req, res, next) => {
  const todoId = req.params.id;
  if (!todoId) next("Invalid Request! TODO ID is Required");
  // TODO: handle Delete Todo
  next();
};
