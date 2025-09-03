const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  const name = req.query.name;
  console.log(name);
  if (name) {
    res.send(
      `Hey ${name[0].toUpperCase() + name.slice(1).toLowerCase()}! This is Home`
    );
  } else {
    res.send("THIS IS HOME ROUTE");
  }
});

app.get("/about", (req, res) => {
  res.send("This is the About");
});

app.get("/contact", (req, res) => {
  res.send("This is the Contact route");
});
app.listen(PORT, (req, res) => {
  console.log(`Server listening on ${PORT}`);
});
