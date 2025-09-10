const tryCatch = require("../utils/tryCatch");
const Todo = require("../schema/todo.schema");
const createResponse = require("../utils/createResponse");

exports.getTodos = tryCatch(async (req, res, next) => {
  const todoId = req.params.id;
  const { page, limit } = req.query;
  let response, message;

  if (todoId) {
    response = await Todo.findById(todoId);
    message = `Todo with ID ${todoId}`;
  } else if (page) {
    const defaultLimit = parseInt(limit) || 10;

    const parsedPage = parseInt(page);

    const skip = (parsedPage - 1) * defaultLimit;

    const todos = await Todo.find()
      .skip(skip)
      .limit(defaultLimit)
      .sort({ createAt: -1 });

    response = {
      page: parsedPage,
      limit: defaultLimit,
      data: todos,
    };
  } else {
    const { user_id } = req.body;
    response = await Todo.find({ user_id });
    message = `Todos for user ${user_id}`;
  }

  if (response && response.length !== 0) {
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
  } else {
    const error = new Error("Todo not found");
    error.status = 404;
    next(error);
  }
});

exports.createTodo = tryCatch(async (req, res, next) => {
  const todo = await Todo.create(req.body);
  if (todo) {
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
  } else {
    const error = new Error("Something Went Wrong!");
    error.status = 500;
    next(error);
  }
});

exports.updateTodo = tryCatch(async (req, res, next) => {
  const todoId = req.params.id;
  const todo = await Todo.findByIdAndUpdate(todoId, req.body, { new: true });
  if (todo) {
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
  } else {
    const error = new Error("Todo not found");
    error.status = 404;
    next(error);
  }
});

exports.deleteTodo = tryCatch(async (req, res, next) => {
  const todoId = req.params.id;
  const todo = await Todo.findByIdAndDelete(todoId);
  if (todo) {
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
  } else {
    const error = new Error("Todo not found");
    error.status = 404;
    next(error);
  }
});
