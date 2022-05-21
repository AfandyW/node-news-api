const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const config = require("./config/index")

mongoose
  .connect(
    config.URLDB
  )
  .catch((err) => console.log(err));

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong",
  });
});

app.use("/api/v1", routes);

const port = config.PORT;

app.listen(port, () => console.log(`app listening on port ${port}!`));
