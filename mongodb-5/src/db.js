const mongoose = require("mongoose");
const { tryCatchErrorHandler } = require("./utils/tryCatch.js");
async function connectDB() {
  await tryCatchErrorHandler(
    async () => {
      let DB_URL;
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connected");
    },
    (err) => {
      console.log("MongoDB connection error: ", err.message);
      process.exit(1);
    }
  );
}

module.exports = connectDB;
