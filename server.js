// CONFIGURING THE SERVER
const express     = require('express');
const app         = express();
const port        = process.env.PORT || 8080;
const morgan      = require('morgan');
const mongoose    = require('mongoose');

// DECLARE THE SCHEMA
const User        = require('./app/models/user');
const Dairy       = require('./app/models/dairy');

// ADD DEPENDENCY FOR MIDDLEWARE
const bodyParser  = require('body-parser');
const path        = require('path');

// FACEBOOK LOGIN
const passport    = require('passport');
const social      = require('./app/passport/passport')(app, passport);
  
//Call the Api
const router    = express.Router();
const appRoutes = require('./app/routes/api')(router);
const userRoutes = require('./app/routes/userApi')(router);
const middleRoutes = require('./app/routes/middleApi')(router);

//INITIALIZE MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
app.use('/userApi', userRoutes);
app.use('/middleApi', middleRoutes);

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