// API SERVICE 
// CODE BELOW FOR TESTING UNIT

// ADD THE SCHEMA
var User = require("../models/user");
var Dairy = require("../models/dairy");

// ADD LIBRARY
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');

// SESSION PURPOSE **USING JSONWEBTOKEN
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

// === Include customi services === //
var jsonfile = require('jsonfile');
var predict = require("../services/predict");

// Global Variable
var baseDir = process.cwd();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    img: {data: Buffer, contentType: String}
});

var A = mongoose.model('A', schema);

var storage = multer.diskStorage({
    destination: baseDir + "/public/assets/img/user_profile/",
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' +  path.extname(file.originalname));
        });
    }
});

var upload = multer({
    storage: storage,
    limit: {filesize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: Image Only! ");
    }
}

module.exports = function (router) {
    // // LOGIN REGISTRATION
    // router.post('/users', function (req, res) {
    //     var user = new User();
    //     user.username = req.body.username;
    //     user.password = req.body.password;
    //     user.email = req.body.email;
    //     user.userShortName = req.body.userShortName;
    //     user.userLongName = req.body.userLongName;
    //     user.province = req.body.province;
    //     user.city = req.body.city;
    //     user.district = req.body.district;
    //     user.phone = req.body.phone;
    //     user.address = req.body.address;
    //     user.userCategory = req.body.userCategory;
    //
    //     //define criteria for post
    //     if (req.body.username == null || req.body.username === '' || req.body.password == null || req.body.password === '' ||
    //         req.body.email == null || req.body.email === '' || req.body.userShortName == null || req.body.userShortName === '' ||
    //         req.body.userLongName == null || req.body.userLongName === '' || req.body.province == null ||
    //         req.body.province === '' || req.body.city == null || req.body.city === '' || req.body.district == null ||
    //         req.body.district === '' || req.body.phone == null || req.body.phone === '' || req.body.userCategory == null ||
    //         req.body.userCategory === '') {
    //         res.json({success: false, message: "Pastikan semua terisi"});
    //     } else {
    //         user.save(function (err) {
    //             if (err) {
    //                 res.json({success: false, message: err.errors});
    //             } else {
    //                 res.json({success: true, message: "User created"});
    //             }
    //         });
    //     }
    // });
    //
    // router.post('/imgUpload', function (req, res) {
    //     upload(req, res, function (err) {
    //         // console.log(`Username ${req.body.username}`);
    //         if (err) {
    //             res.json({success: false, message: "Error: File not found"});
    //         } else {
    //             if (req.file === undefined) {
    //                 res.json({success: false, message: "No File Selected!"});
    //             } else {
    //                 res.json({
    //                     success: true,
    //                     message: "File uploaded",
    //                     file: baseDir + `/public/assets/img/user_profile/${req.file.filename}`
    //                 });
    //             }
    //         }
    //     })
    // });
    //
    // // USER LOGIN
    // router.post('/authenticate', function (req, res) {
    //     User.findOne({username: req.body.username}).select('email username password').exec(function (err, user) {
    //         if (err) throw err;
    //
    //         if (!user) {
    //             res.json({success: false, message: 'Could not authenticate user'});
    //         } else if (user) {
    //             if (req.body.password) {
    //                 var validPassword = user.comparePassword(req.body.password);
    //             } else {
    //                 res.json({success: false, message: 'No password detected'});
    //             }
    //             if (!validPassword) {
    //                 res.json({success: false, message: 'Could not authenticate password'});
    //             } else {
    //                 //SAVE SESSION
    //                 var token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
    //
    //                 res.json({success: true, message: 'User authenticate!', token: token});
    //             }
    //         }
    //     });
    // });

    // ADD THE DATASET
    router.post('/dairy', function (req, res) {
        var basedir = process.cwd();
        var dairyPath = basedir + "/app/dataset/kattle.json";
        jsonfile.readFile(dairyPath, function (err, obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    var dairy = new Dairy();
                    dairy.year = obj[prop].year;
                    dairy.land = obj[prop].land;
                    dairy.labour = obj[prop].labour;
                    dairy.capital = obj[prop].capital;
                    dairy.materials = obj[prop].materials;
                    dairy.services = obj[prop].services;
                    dairy.population = obj[prop].population;
                    dairy.input = obj[prop].input;
                    dairy.output = obj[prop].output;
                    dairy.tfp = obj[prop].tfp;
                    dairy.save();
                }
            }
        });
        res.json({message: "Data baru telah ditambahkan"});
    });

    // GET THE LIST OF DATASET PRODUCTIVITY
    // parent controller for dairy controller
    router.post('/dairiesList', function (req, res) {
        Dairy.find({}, function (err, dairies) {
            var dairyMap = {},
                dairyArray = [];

            dairies.forEach(function (dairy) {
                dairyMap[dairy._id] = dairy;
            });
            dairyArray = predict.convertToArray(dairyMap, "year");

            res.json({dairy: dairyArray});
        });
    });

    router.post('/dairiesMining', function (req, res) {
        var dairyData = [];
        dairyData = req.body;
        dairyModel = predict.processLearning(dairyData);

        res.json({dairy: dairyModel});
    });

    // Call the middleware to get the token
    // router.use(function (req, res, next) {
    //     var token = req.body.token || req.body.query || req.headers['x-access-token'];
    //     if (token) {
    //         jwt.verify(token, secret, function (err, decoded) {
    //             if (err) {
    //                 res.json({success: false, message: 'Token invalid'});
    //             } else {
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         });
    //     } else {
    //         res.json({success: false, message: 'No token'});
    //     }
    // });
    //
    // // Get the tokenizing user
    // router.post('/me', function (req, res) {
    //     res.send(req.decoded);
    // });

    return router;
};