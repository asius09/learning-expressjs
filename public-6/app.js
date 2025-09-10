const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server is listening on PORT", PORT);
});
