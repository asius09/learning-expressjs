function validateTitleAndCompleted(title, completed, errors) {
  if (title === undefined || title === null || title === "") {
    errors.push("Invalid Request: Todo Title Required");
  } else if (typeof title !== "string") {
    errors.push("TypeError: Title should be string");
  }
  if (completed === undefined || completed === null) {
    errors.push("Invalid Request: Completed Status Required");
  } else if (typeof completed !== "boolean") {
    errors.push("TypeError: Completed should be boolean");
  }
}

function validateTodo(req, res, next) {
  let errors = [];
  const method = req.method;
  const todoId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    const error = new Error("Invalid Request: User ID should be provided.");
    error.status = 400;
    return next(error);
  }

  if ((method === "PUT" || method === "DELETE") && !todoId) {
    errors.push("Invalid Request: Todo ID Required");
  }

  if (method === "POST" || method === "PUT") {
    const { title, completed } = req.body;
    validateTitleAndCompleted(title, completed, errors);
  }

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    return next(error);
  }

  next();
}

module.exports = validateTodo;
