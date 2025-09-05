async function tryCatch(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
async function tryCatchAsync(fn, onError) {
  return function (...args) {
    Promise.resolve(fn.apply(...args)).catch(onError);
  };
}

