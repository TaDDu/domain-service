var express = require("express");
var jwt = require("jsonwebtoken");
const config = require(process.cwd() + "/config/config.json");
require("./sequelize.js");
const app = express();

app.use("/", AuthMe, require("./domains/index.js"));

function AuthMe(req, res, next) {
  if (
    req.headers["authorization"] == null ||
    req.headers["authorization"] == undefined ||
    req.headers["authorization"] == ""
  ) {
    res.status(400).json({ error: true, message: "authorization missing" });
  } else {
    var token = req.headers["authorization"];
    token = token.split(" ");
    if (token[0] == "Bearer") {
      jwt.verify(token[1], process.env.SECRET || config.SECRET, function(
        err,
        decoded
      ) {
        if (err) {
          res.status(400).json({ error: true, message: "Not authorized" });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res
        .status(400)
        .json({ error: true, message: "wrong authorization type" });
    }
  }
}

module.exports = app;
