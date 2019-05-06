// MIDDLEWARE API SERVICE
// ADD SCHEMA
let User = require("../models/user");

// ADD LIBRARY
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let secret = "harrypotter";

module.exports = function(router) {
  router.use(function(req, res, next) {
    let token =
      req.body.token || req.body.query || req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: "Token invalid" });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({ success: false, message: "No token" });
    }
  });

  // Get the tokenizing user
  router.post("/me", function(req, res) {
    res.send(req.decoded);
  });

  return router;
};
