var express = require("express");
var app = express();
var routes = require("./routes.js");

app.use("/domains", routes);

module.exports = app;
