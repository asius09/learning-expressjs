exports.validate = (req, res, next) => {
  let err = [];
  if (req.method === "POST") {
    const { title, completed, createAt } = req.body;
    if (!title) err.push("Invalid Request: Todo Title Required");
    if (!completed) err.push("Invalid Request: Completed Status Required");
    if (!createAt) {
      // Parse createAt
      req.body.createAt = new Date().toISOString();
    }
    if (typeof title === "string")
      err.push("TypeError: Title should be string");
    if (typeof completed === "boolean")
      err.push("TypeError: Completed should be boolean");
    return err.length > 0 ? next(err) : next();
  } else if (req.method === "PUT" || req.method === "DELETE") {
    const todoId = req.params.id;
    if (!todoId) err.push("Invalid Request: Todo ID Required");
    if (todoId && typeof todoId !== "string")
      err.push("Type Error: Todo ID should be string");
    return err.length > 0 ? next(err) : next();
  }
};
