// API SERVICE 
// CODE BELOW FOR TESTING UNIT

// ADD THE SCHEMA
var User    = require("../models/user");

// SESSION PURPOSE **USING JSONWEBTOKEN
var jwt     = require('jsonwebtoken');
var secret  = 'harrypotter';

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
}