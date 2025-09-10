/**
 * Helper function to create an error, set status, and call next(error)
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {function} next - Express next function
 */
function handleError(message, status, next) {
  const error = new Error(message);
  error.status = status;
  return next(error);
}

module.exports = handleError;
