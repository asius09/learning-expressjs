const AUTH_TOKEN_NAME = "auth";
const REFRESH_TOKEN_NAME = "refresh";

/**
 * Sends a simple standardized JSON response and sets or clears auth/refresh token cookies if provided.
 * @param {Object} options - Response options
 * @param {number} options.status - HTTP status code
 * @param {any} [options.data=null] - Response data
 * @param {any} [options.error=null] - Error details
 * @param {string} [options.message=""] - Response message
 * @param {boolean} [options.success=false] - Success flag
 * @param {string} [options.token=""] - Auth token to set as cookie
 * @param {string} [options.refreshToken=""] - Refresh token to set as cookie
 * @param {boolean} [options.clearCookies=false] - If true, clear auth and refresh token cookies
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
    refreshToken = "",
    clearCookies = false,
  },
  res
) {
  if (clearCookies) {
    res.clearCookie(AUTH_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie(REFRESH_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  } else {
    if (token && token !== "") {
      res.cookie(AUTH_TOKEN_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000,
      });
    }
    if (refreshToken && refreshToken !== "") {
      res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
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
