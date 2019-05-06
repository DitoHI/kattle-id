var FacebookStrategy = require("passport-facebook").Strategy;
var User = require("../models/user");
var session = require("express-session");

module.exports = function(app, passport) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: "165690080755182",
        clientSecret: "90ed1025e04d49d31cd3ce44422fc39d",
        callbackURL: "https://localhost:8080/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "emails"]
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        // User.findOrCreate(..., function(err, user) {
        //   if (err) { return done(err); }
        //   done(null, user);
        // });
        done(null, profile);
      }
    )
  );

  //get special permission
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  // TRIAL TWO
  var FACEBOOK_APP_ID = "422901108132359",
    FACEBOOK_APP_SECRET = "d44c4b92194077c9b722f1b9783d84d6";

  var fbOpts = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  };

  var fbCallback = function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
  };

  passport.use(new FacebookStrategy(fbOpts, fbCallback));

  app.route("/auth/facebook").get(passport.authenticate("facebook"));

  app.route("/auth/facebook/callback").get(function(req, res) {
    res.send("check status of facebook callback");
  });

  return passport;
};
