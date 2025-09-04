const express = require("express");
const app = express();
const PORT = 3000;
const userRoutes = require("./src/routes/userRoutes.js");
const createResponse = require("./src/utils/createResponse.js");
const { handleLogs } = require("./src/middleware/useMiddleware.js");
app.use((req, res, next) => {
  handleLogs(req, res, next);
  next();
});
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json(
    createResponse({
      success: false,
      data: null,
      message: err.message,
      error: err,
    })
  );
});
app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
