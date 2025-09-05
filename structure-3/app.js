const express = require("express");
const app = express();
const PORT = 3000;
const userRoutes = require("./src/routes/userRoutes.js");
const createResponse = require("./src/utils/createResponse.js");
const { handleLogs } = require("./src/middleware/useMiddleware.js");
//check weather request is json or not.
app.use(express.json());
app.use((req, res, next) => {
  const body = req.body;
  if (!body.id) {
    res.status(400).json(
      createResponse({
        success: false,
        data: null,
        message: "ID Required",
        error: "Invalide Request",
      })
    );
  }
  next();
});

app.use(handleLogs);

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
