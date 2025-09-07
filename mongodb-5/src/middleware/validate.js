exports.validate = (req, res, next) => {
  let err = [];

  if (req.method === "POST") {
    const { title, completed } = req.body;

    if (!title) err.push("Invalid Request: Todo Title Required");
    if (typeof title !== "string")
      err.push("TypeError: Title should be string");

    if (completed === undefined)
      err.push("Invalid Request: Completed Status Required");
    if (typeof completed !== "boolean")
      err.push("TypeError: Completed should be boolean");
  }

  if (req.method === "PUT") {
    const todoId = req.params.id;
    if (!todoId) err.push("Invalid Request: Todo ID Required");
    const { title, completed } = req.body;
    if (!title || !completed)
      err.push(
        "Invalid Request! Update field Required either title or completed"
      );
    if (title) {
      if (!title) err.push("Invalid Request: Todo Title Required");
      if (typeof title !== "string")
        err.push("TypeError: Title should be string");
    }
    if (completed) {
      if (completed === undefined)
        err.push("Invalid Request: Completed Status Required");
      if (typeof completed !== "boolean")
        err.push("TypeError: Completed should be boolean");
    }
  }

  if (req.method === "DELETE") {
    const todoId = req.params.id;
    if (!todoId) err.push("Invalid Request: Todo ID Required");
  }

  if (err.length > 0) {
    // Create an error object and pass to next
    const error = new Error("Invalid Request");
    error.status = 400; // Bad Request
    error.details = err;
    return next(err);
  }
  next();
};
