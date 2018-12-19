require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const eStatics = require("e-statics")(app);

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(eStatics.counter);

app.use("/api", require("./lib"));

var port = process.env.PORT;
app.listen(port, function() {
  console.log("Server started at port: %i", port);
});
