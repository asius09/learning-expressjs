const { createResponse } = require("./createResponse");

exports.handleError = (err, req, res, next) => {
  const status = err.status || 500;

  createResponse(
    {
      status,
      data: null,
      error: err.details || [err.message || "Something went wrong"],
      message: err.message || "Error",
      success: false,
    },
    res
  );
};
