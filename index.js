const mongoose = require("mongoose");
const express = require("express");
const app = express();

const users = require("./routes/users");

app.use(express.json());

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("Could not connect to mongo db", err));

app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is listing on port ${port}...`);
});
