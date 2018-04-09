// API SERVICE 
// CODE BELOW FOR TESTING UNIT

// ADD THE SCHEMA
var User    = require("../models/user");
var Dairy   = require("../models/dairy");

// SESSION PURPOSE **USING JSONWEBTOKEN
var jwt     = require('jsonwebtoken');
var secret  = 'harrypotter';

// === Include customize services === //
var jsonfile = require('jsonfile');
var predict = require("../services/predict");

module.exports = function(router) {
    // LOGIN REGISTRATION
    router.post('/users', function(req, res){
        var user = new User();
        user.username   = req.body.username;
        user.password   = req.body.password;
        user.email      = req.body.email;
        //define criteria for post
        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == ''
            || req.body.email == null || req.body.email == ''){
            res.json({ success : false, message: "Ensure username, password, and email provided"});
        } else{ 
            user.save(function(err){
                if (err) {
                    res.json({ success : false, message: "Username of Email already exist"});
                } else{
                    res.json({ success : true, message: "User created"});
                }
            });
        }
    });

    // USER LOGIN
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user){
            if (err) throw err;

            if (!user){
                res.json({ success: false, message: 'Could not authenticate user' });
            } else if (user) {
                if(req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({success: false, message: 'No password detected'});
                }
                if (!validPassword){
                    res.json({ success: false, message: 'Could not authenticate password'});
                } else{
                    //SAVE SESSION
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'} );

                    res.json({ success: true, message: 'User authenticate!', token: token });
                }
            }
        });
    });

    // ADD THE DATASET
    router.post('/dairy', function (req, res) {
        var basedir = process.cwd();
        var dairyPath = basedir + "/app/dataset/kattle.json";
        jsonfile.readFile(dairyPath, function (err, obj) {
            for (var prop in obj){
                if (obj.hasOwnProperty(prop)){
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
        res.json({ message: "Data baru telah ditambahkan" });
    });

    // GET THE LIST OF DATASET PRODUCTIVITY
    router.post('/dairiesList', function (req, res) {
        Dairy.find({}, function (err, dairies) {
            var dairyMap = {},
                dairyArray = [];

            dairies.forEach(function (dairy) {
                dairyMap[dairy._id] = dairy;
            });
            dairyArray = predict.convertToArray(dairyMap, "year");
            // dairyModel = predict.processLearning(dairyArray);

            res.json({ dairy: dairyArray });
        });
    });

    router.post('/dairiesMining', function (req, res) {
        var dairyData = [];
        dairyData = req.body;
        dairyModel = predict.processLearning(dairyData);

        res.json({ dairy: dairyModel });
    });

    // Call the middleware to get the token
    router.use(function(req, res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, secret, function (err, decoded) {  
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token' });
        }
    });

    // Get the tokenizing user
    router.post('/me', function(req, res) {  
        res.send(req.decoded);
    });

    return router;
};