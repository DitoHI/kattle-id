const mongoose = require("mongoose");

module.exports = {
  init: () => {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);

    switch (process.env.NODE_ENV) {
      case "development": {
        const mongodbUri = "mongodb://localhost:27017/kattle";
        mongoose
          .connect(mongodbUri, { useCreateIndex: true, useNewUrlParser: true })
          .then(
            () => {
              console.info(`Mongoose connected at ${mongodbUri}`);
            },
            err => {
              console.error(err);
            }
          );

        break;
      }
      case "production": {
        mongoose
          .connect(process.env.MONGODB_URI_TEST, {
            useCreateIndex: true,
            useNewUrlParser: true
          })
          .then()
          .catch();
        break;
      }
      default:
        break;
    }
  }
};
