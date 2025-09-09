const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const handleError = require("./src/utils/handleError");
const app = express();
const todoRoutes = require("./src/routes/todo.routes");
const userRoutes = require("./src/routes/user.routes");
const connectDB = require("./db");
const logger = require("./src/middleware/logger");
const verifyToken = require("./src/middleware/verifyToken");
const TODO_ROUTE = "/todos";
const USER_ROUTE = "/users";
const PORT = process.env.PORT;

// Connect to the database
connectDB();
app.use(cookieParser());
// Middleware to parse JSON
app.use(express.json());

// Custom logger middleware
app.use(logger);

// Mount user and todo routes
app.use(USER_ROUTE, userRoutes);

app.use(verifyToken);
app.use(TODO_ROUTE, todoRoutes);

// Handle undefined routes (all methods, all paths)
app.all("/", (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

// Centralized error handling middleware
app.use(handleError);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
