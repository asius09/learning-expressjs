const AUTH_TOKEN_NAME = "auth";

/**
 * Sends a simple standardized JSON response and sets an auth token cookie if provided.
 * @param {Object} options - Response options
 * @param {number} options.status - HTTP status code
 * @param {any} [options.data=null] - Response data
 * @param {any} [options.error=null] - Error details
 * @param {string} [options.message=""] - Response message
 * @param {boolean} [options.success=false] - Success flag
 * @param {string} [options.token=""] - Auth token to set as cookie
 * @param {Object} res - Express response object
 */
function createResponse(
  {
    status,
    data = null,
    error = null,
    message = "",
    success = false,
    token = "",
  },
  res
) {
  if (token && token !== "") {
    res.cookie(AUTH_TOKEN_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  res.status(status).json({
    status,
    data,
    error,
    message,
    success,
  });
}

module.exports = createResponse;
