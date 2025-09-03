const express = require("express");
const app = express();
const PORT = 3000;
const userRoutes = require("./src/routes/userRoutes.js");

app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
