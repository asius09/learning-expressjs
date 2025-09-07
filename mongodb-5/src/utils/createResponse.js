exports.createResponse = (
  { status, data = null, error = [], message = "", success = false },
  res
) => {
  res.status(status).json({ status, data, error, message, success });
};
