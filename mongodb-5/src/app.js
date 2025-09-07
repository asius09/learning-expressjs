const express = require("express");
require("dotenv").config();
const { handleError } = require("./utils/handleError");
const app = express();
const useRoutes = require("./routes/useRoute");
const connectDB = require("./db");
const TODO_ROUTE = "/todos";
const PORT = process.env.PORT;

// Connect Database
connectDB();
// converted into json
app.use(express.json());
app.use(handleError); // central error middleware.
app.use(TODO_ROUTE, useRoutes);
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
