// API Response

/**
 * Create a standardized API response object.
 * @param {Object} options
 * @param {boolean} [options.success=true] - Indicates if the operation was successful.
 * @param {any} [options.data] - The data to return (optional).
 * @param {string} [options.message] - A message to include (optional).
 * @param {any} [options.error] - Error details if any (optional).
 * @returns {Object} API response object.
 */
function createResponse(options = {}) {
  const { success = true, data, message, error } = options;

  const response = { success };

  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  if (error) {
    response.success = false;
    response.error = error;
  }

  return response;
}

module.exports = createResponse;
