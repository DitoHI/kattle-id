// === Add lib ===
var R = require('r-script');

module.exports = {
    // === Process dataset with Generalized Additive Model ===
    processLearning: function (dataArray) {
        // === Preprocessed params of Material & Services to be predictor ===
        // === Reason: Look at the documentation in R Sessions ===
        var basedir = process.cwd();
        var cvError = R(basedir + "/app/r-script/gam-kattle.R")
            .data({ Kattle: dataArray, args: "error" })
            .callSync();
        var result = R(basedir + "/app/r-script/gam-kattle.R")
            .data({ Kattle: dataArray, args: "predict", dataTest: { materials: 100, services: 100 } })
            .callSync();

        return result;
    },

    // === Convert obj to array ===
    convertToArray: function (data, sortArg) {
        var dataArray = [];

        // === Sort the data ascending by year ===
        for (var par in data) {
            if (data.hasOwnProperty(par)) {
                dataArray.push(data[par]);
            }
        }
        dataArray.sort(function (a, b) {
            return a[sortArg] - b[sortArg];
        });

        return dataArray;
    }
};