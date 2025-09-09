function validateUser(req, res, next) {
  if (req.method !== "POST") {
    const error = new Error("Invalid Request Method. Only POST allowed.");
    error.status = 405;
    return next(error);
  }

  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    const error = new Error(
      `Bad Request! Please provide a valid${!email ? " Email" : ""}${
        !password ? " & Password" : ""
      }`
    );
    error.status = 400;
    return next(error);
  }

  if (password.length < 8) {
    const error = new Error(
      "Invalid Password: Password must be at least 8 characters long for security reasons."
    );
    error.status = 400;
    return next(error);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error(
      "Invalid Email: Please provide a valid email address."
    );
    error.status = 400;
    return next(error);
  }

  next();
}

module.exports = validateUser;
