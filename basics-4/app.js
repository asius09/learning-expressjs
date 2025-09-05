require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
/*
app.get("/users", (req, res) => res.send("All Users"));
app.get("/users/:id", (req, res) => {
  console.log(req.params);
  res.send(`Users with ID: ${req.params.id}`);
});
*/

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
