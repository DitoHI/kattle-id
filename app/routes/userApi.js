// USER API SERVICE

// ADD SCHEMA
let User = require("../models/user");

// ADD LIBRARY
let mongoose = require("mongoose");
let fs = require("fs");
let multer = require("multer");
let path = require("path");
let jsonfile = require("jsonfile");
let crypto = require("crypto");

// SESSION PURPOSE USING JSONWEBTOKEN
let jwt = require("jsonwebtoken");
let secret = "dairy";

// Custom Service

// Global Variable
let baseDir = process.cwd();

module.exports = function(router) {
  // Registration
  router.post("/users", function(req, res) {
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.userLongName = req.body.userLongName;
    user.province = req.body.province;
    user.city = req.body.city;
    user.district = req.body.district;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.userCategory = req.body.userCategory;

    //define criteria for post
    if (req.body.username == null || req.body.username === "") {
      res.json({ success: false, message: "Username harus terisi" });
    } else if (req.body.password == null || req.body.password === "") {
      res.json({ success: false, message: "Password harus terisi" });
    } else if (req.body.email == null || req.body.email === "") {
      res.json({ success: false, message: "Email harus terisi" });
    } else if (req.body.userLongName == null || req.body.userLongName === "") {
      res.json({ success: false, message: "Nama panjang harus terisi" });
    } else if (req.body.province == null || req.body.province === "") {
      res.json({ success: false, message: "Provinsi harus terisi" });
    } else if (req.body.city == null || req.body.city === "") {
      res.json({ success: false, message: "Kota harus terisi" });
    } else if (req.body.district == null || req.body.district === "") {
      res.json({ success: false, message: "Kecamatan harus terisi" });
    } else if (req.body.phone == null || req.body.phone === "") {
      res.json({ success: false, message: "Telepon harus terisi" });
    } else if (req.body.userCategory == null || req.body.userCategory === "") {
      res.json({ success: false, message: "Kategori harus terisi" });
    } else {
      user.save(function(err) {
        if (err) {
          res.json({ success: false, message: "User gagal terbuat" });
        } else {
          res.json({ success: true, message: "User telah terbuat" });
        }
      });
    }
  });

  // Login
  router.post("/authenticate", function(req, res) {
    User.findOne({ username: req.body.username })
      .select("email username password")
      .exec(function(err, user) {
        if (err) throw err;

        let validPassword;
        if (!user) {
          res.json({ success: false, message: "Could not authenticate user" });
        } else if (user) {
          if (req.body.password) {
            validPassword = user.comparePassword(req.body.password);
          } else {
            res.json({ success: false, message: "No password detected" });
          }
          if (!validPassword) {
            res.json({
              success: false,
              message: "Could not authenticate password"
            });
          } else {
            //SAVE SESSION
            let token = jwt.sign(
              { username: user.username, email: user.email },
              secret,
              { expiresIn: "24h" }
            );

            res.json({
              success: true,
              message: "User authenticate!",
              token: token
            });
          }
        }
      });
  });

  router.post("/getListLocation", function(req, res) {
    let args = req.body.locData;
    let childId = req.body.childId;
    let parentArgs = undefined;
    if (args === "kota") {
      parentArgs = "provinsi";
    } else if (args === "kecamatan") {
      parentArgs = "kota";
    }

    let locationRes = baseDir + `/app/dataset/${args}.json`;
    let locObject = [];

    // Placeholder for Select & Option
    let firstObject = {};
    firstObject["name"] = `Pilih ${toTitleCase(args)}`;
    firstObject[`${args}_id`] = 0;
    locObject.push(firstObject);

    jsonfile.readFile(locationRes, function(err, obj) {
      for (let prob in obj) {
        if (obj.hasOwnProperty(prob)) {
          if (
            childId === null ||
            (childId !== null && childId === obj[prob][`${parentArgs}_id`])
          ) {
            let newObject = {};
            newObject["name"] = obj[prob]["name"];
            newObject["id"] = obj[prob][`${args}_id`];
            locObject.push(newObject);
          }
        }
      }
      res.json({ message: "Sukses", location: locObject });
    });

    // add on function
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  });

  // Upload image to User
  router.post("/uploadImage", function(req, res) {
    let checkFileType = function(file, cb) {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extName = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimeType = fileTypes.test(file.mimetype);

      if (mimeType && extName) {
        return cb(null, true);
      } else {
        cb("Error: Image Only! ");
      }
    };

    let storage = multer.diskStorage({
      destination: baseDir + "/public/assets/img/user_profile/",
      filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
          cb(
            null,
            raw.toString("hex") + Date.now() + path.extname(file.originalname)
          );
        });
      }
    });

    let upload = multer({
      storage: storage,
      limit: { filesize: 1000000 },
      fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
      }
    }).single("file");

    upload(req, res, function(err) {
      // console.log(`Username ${req.body.username}`);
      const username = req.body.username;

      if (err) {
        res.json({ success: false, message: "Error: File not found" });
      } else {
        if (req.file === undefined) {
          res.json({ success: false, message: "No File Selected!" });
        } else {
          const imageDir =
            baseDir + `/public/assets/img/user_profile/${req.file.filename}`;
          User.findOne({ username: username }, (err, user) => {
            user.photoProfile = imageDir;
            user.save(function(err) {
              if (!err) {
                res.json({
                  success: true,
                  message: "File uploaded",
                  file: imageDir
                });
              } else {
                res.json({
                  success: false,
                  message: "Not saved to database",
                  file: imageDir
                });
              }
            });
          });
        }
      }
    });
  });

  return router;
};
