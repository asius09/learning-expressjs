const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const handleError = require("./src/utils/handleError");
const todoRoutes = require("./src/routes/todo.routes");
const userRoutes = require("./src/routes/user.routes");
const app = express();
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

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req[user-agent] :total-time :user-agent",
    {
      stream: fs.createWriteStream(path.join(__dirname, "logs/access.log"), {
        flags: "a",
      }),
    }
  )
);

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
