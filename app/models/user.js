// DEFINE SCHEMA
// CODE BELOW FOR TESTING UNIT

// ADD DEPENDENCY
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validate = require("mongoose-validator");

// FOR DECRYPTION PURPOSE
const bcrypt = require("bcrypt-nodejs");

// FOR VALIDATION PURPOSE
const longNameValidator = [
  validate({
    validator: "matches",
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)$/,
    message:
      "Must be at least 3 Characters, max 30, no special characters or numbers, must have space between name"
  })
];

const emailValidator = [
  validate({
    validator: "isEmail",
    message: "Not a valid email"
  }),
  validate({
    validator: "isLength",
    arguments: [3, 25],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters"
  })
];

const usernameValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 25],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters"
  }),
  validate({
    validator: "isAlphanumeric",
    message: "Username must contain letters and numbers only"
  })
];

const passwordValidator = [
  validate({
    validator: "matches",
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message:
      "Password at least one uppercase, one number, one special characaters, and must be at least 8 characters not more than 35 characters"
  })
];

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: usernameValidator
  },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: emailValidator
  },
  userLongName: { type: String, required: true, validate: longNameValidator },
  province: { type: Number, required: true },
  city: { type: Number, required: true },
  district: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  userCategory: { type: String, required: true },
  photoProfile: { type: String }
});

// MIDDLEWARE - DECRYPT THE PASSWORD
UserSchema.pre("save", function(next) {
  let user = this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// AUTHENTICATE - CHECK THE PASSWORD
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
