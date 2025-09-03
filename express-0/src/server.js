const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/user/:id", (req, res) => {
  res.send(`User ID : ${req.params.id}`);
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
