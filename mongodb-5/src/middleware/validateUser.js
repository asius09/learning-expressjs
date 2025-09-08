/**
 * validateUser middleware
 * - Only allows POST requests (for signup/login)
 * - Validates presence and type of email and password
 * - Ensures password is at least 8 characters
 * - Handles and logs errors appropriately
 */
function validateUser(req, res, next) {
  console.log(`[validateUser] Called for ${req.method} ${req.originalUrl}`);

  // ERROR 1: Wrong logic for method check (should be AND, not OR)
  // Original: if (req.method !== "POST" || req.method !== "GET")
  // This always passes, because a method can't be both at once.
  // Correct: Only allow POST (for signup/login)
  if (req.method !== "POST") {
    console.warn("[validateUser] Invalid Request Method:", req.method);
    const error = new Error("Invalid Request Method. Only POST allowed.");
    error.status = 405; // Method Not Allowed
    return next(error);
  }

  // ERROR 2: Should check for missing fields more robustly
  const { email, password } = req.body;

  // Check for missing email or password
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    console.warn(
      `[validateUser] Bad Request! Missing or invalid fields: ${!email ? "Email" : ""} ${
        !password ? "& Password" : ""
      }`
    );
    const error = new Error(
      `Bad Request! Please provide a valid${!email ? " Email" : ""}${
        !password ? " & Password" : ""
      }`
    );
    error.status = 400;
    return next(error);
  }

  // ERROR 3: Password length check should be after type check
  if (password.length < 8) {
    const error = new Error(
      "Invalid Password: Password must be at least 8 characters long for security reasons."
    );
    error.status = 400;
    return next(error);
  }

  // Optionally: Validate email format (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid Email: Please provide a valid email address.");
    error.status = 400;
    return next(error);
  }

  console.log("[validateUser] Validation passed");
  next();
}

module.exports = validateUser;
