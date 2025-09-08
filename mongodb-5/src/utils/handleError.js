const createResponse = require("./createResponse");

function handleError(err, req, res, next) {
  const status = err.status || 500;
  const errorDetails =
    err.details ||
    (err.message
      ? [{ message: err.message }]
      : [{ message: "Something went wrong" }]);

  createResponse(
    {
      status,
      data: null,
      error: errorDetails,
      message: err.message || "An unexpected error occurred.",
      success: false,
    },
    res
  );
}

module.exports = handleError;
