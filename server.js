// CONFIGURING THE SERVER
var express     = require('express');
var app         = express();
var port        = process.env.PORT || 8080;
var morgan      = require('morgan');
var mongoose    = require('mongoose');

// DECLARE THE SCHEMA
var User        = require('./app/models/user');
var Dairy       = require('./app/models/dairy');

// ADD DEPENDENCY FOR MIDDLEWARE
var bodyParser  = require('body-parser');
var path        = require('path');

// FACEBOOK LOGIN
var passport    = require('passport');
var social      = require('./app/passport/passport')(app, passport);
  
//Call the Api
var router    = express.Router();
var appRoutes = require('./app/routes/api')(router);

//INITIALIZE MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

//Connect to mongodb
mongoose.connect('mongodb://localhost:27017/tutorial', function(err){
    if (err) {
        console.log('Not connected to database: ' + err);
    } else {
        console.log('Successfully to connect to Mongodb');
    }
});

// REDIRECTiNG TO THE FRONT END
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log("Running the server on port " + port);
});