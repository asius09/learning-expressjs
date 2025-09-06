const express = require("express");
const { handleError } = require("./utils/handleError");
const app = express();
const TODO_ROUTE = "/todos";
const useRoutes = require("./routes/useRoute");

// converted into json
app.use(express.json());
app.use(handleError); // central error middleware.
app.use(TODO_ROUTE, useRoutes);