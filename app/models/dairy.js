// DEFINE SCHEMA
// CODE BELOW FOR ADDING DATASET
// DATASET DESCRIPTION
// PRODUCTIVITY OF DAIRY PRODUCTS FROM AUSTRALIAN GOVERNMENT

// ADD DEPENDENCY
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// SCHEMA FOR DATASET: PRODUCTIVITY
var DairySchema  = new Schema({
    year        : { type: Number, default: 0, unique: true },
    land        : { type: Number, default: 0, required: true },
    labour      : { type: Number, default: 0, required: true },
    capital     : { type: Number, default: 0, required: true },
    materials   : { type: Number, default: 0, required: true },
    services    : { type: Number, default: 0, required: true },
    population  : { type: Number, default: 0, required: true },
    input       : { type: Number, default: 0, required: true },
    output      : { type: Number, default: 0, required: true },
    tfp         : { type: Number, default: 0, required: true },
});

module.exports = mongoose.model('Dairy', DairySchema);



