require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const handleError = require("./src/utils/handleError");
const todoRoutes = require("./src/routes/todo.routes");
const userRoutes = require("./src/routes/user.routes");
const connectDB = require("./db");
const logger = require("./src/middleware/logger");
const verifyToken = require("./src/middleware/verifyToken");
const mycors = require("./src/middleware/cors");
const limiter = require("./src/middleware/limiter");
const verifyRefreshToken = require("./src/middleware/verifyRefreshToken");
const errorHandler = require("./src/middleware/errorHandler");
const createMorganLogger = require("./src/middleware/createMorganLogger");

const app = express();
const TODO_ROUTE = "/todos";
const USER_ROUTE = "/users";
const PORT = process.env.PORT;

connectDB();
app.use(helmet());

app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use(mycors);

app.use(limiter);
app.use(createMorganLogger());
app.use(logger);


app.use(USER_ROUTE, userRoutes);

app.use(verifyRefreshToken);
app.use(verifyToken);
app.use(TODO_ROUTE, todoRoutes);

// Handle undefined routes (all methods, all paths)
app.all("/", (req, res, next) => {
  handleError(`Route ${req.originalUrl} not found`, 404, next);
});

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
