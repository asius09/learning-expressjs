const { tryCatch } = require("../utils/tryCatch");
const Todo = require("../schema/todo.schema");
const { createResponse } = require("../utils/createResponse");
exports.getTodos = async (req, res, next) => {
  const todoId = req.params.id;
  let response,
    message = "";
  if (todoId) {
    const todoById = await tryCatch(async (req, res, next) => {
      await Todo.findById(todoId);
    });
    response = todoById;
    message = `Todo with ID ${todoId}`;
  } else {
    const todos = await tryCatch(async (req, res, next) => {
      await Todo.find();
    });
    response = todos;
    message = `All Todos`;
  }
  createResponse(
    {
      status: 200,
      data: response,
      success: true,
      error: null,
      message,
    },
    res
  );
};

exports.createTodo = async (req, res, next) => {
  const todo = await tryCatch(async (req, res, next) => {
    await Todo.findById(todoId);
  });
  createResponse(
    {
      status: 201,
      data: todo,
      success: true,
      error: null,
      message: "Created Todo",
    },
    res
  );
};
exports.updateTodo = async (req, res, next) => {
  const todoId = req.params.id;
  const todo = await tryCatch(async (req, res, next) => {
    await Todo.findByIdAndUpdate(todoId, req.body);
  });
  createResponse(
    {
      status: 200,
      data: todo,
      success: true,
      error: null,
      message: "Updated Todo",
    },
    res
  );
};
exports.deleteTodo = async (req, res, next) => {
  const todoId = req.params.id;
  const todo = await tryCatch(async (req, res, next) => {
    await Todo.findByIdAndDelete(todoId);
  });
  createResponse(
    {
      status: 200,
      data: todo,
      success: true,
      error: null,
      message: "Deleted Todo",
    },
    res
  );
};
