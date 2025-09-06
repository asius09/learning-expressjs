const { createResponse } = require("./createResponse");

function formateError(e) {
  let err = [];
  let message = "";
  if (!e) {
    err.push["Invalid Request"];
    message = "Invalid Request";
  }
  if (typeof e === "string") {
    err.push[e.message];
    message = e.message;
  }
  if (typeof e === "object") {
    err.push[e.message];
    err.push[e.name];
    message = e.message;
  }
  return {
    message,
    error: err,
  };
}
exports.handleError = (err, req, res, next) => {
  const errData = formateError(err);
  createResponse(
    {
      status: err.status || 500,
      data: null,
      error: errData.error,
      message: errData.message,
      success: false,
    },
    res
  );
};
