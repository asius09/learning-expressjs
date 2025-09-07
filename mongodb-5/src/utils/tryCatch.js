const { handleError } = require("./handleError");

exports.tryCatch = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

exports.tryCatchErrorHandler = (fn, onError) => {
  return function (...args) {
    Promise.resolve(fn(...args)).catch((err) => {
      const error = handleError(err);
      onError(error);
    });
  };
};
