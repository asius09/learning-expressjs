exports.createResponse = (
  { status, data = null, error = [], message = "", success = false },
  res
) => {
  res.json(JSON.stringify({ status, data, error, message, success }));
};
