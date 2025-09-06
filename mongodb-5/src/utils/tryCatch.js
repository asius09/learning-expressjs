exports.tryCatch = async (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

exports.handleError = (err) => {
  let message = "";
  if (typeof err === Object) {
    message = err.message;
  } else if (typeof err === String) {
    message = err;
  } else {
    message = err || "Invalid Request";
  }
  return {
    message,
    err: err,
  };
};
