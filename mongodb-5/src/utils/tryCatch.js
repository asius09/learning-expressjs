const { handleError } = require("./handleError");

exports.tryCatch = async (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

exports.tryCatchErrorHandler = async (fn, onError) => {
  return function (...arg) {
    Promise.resolve(fn.apply(...arg)).catch((err) => {
      const error = handleError(err);
      onError(error);
    });
  };
};
