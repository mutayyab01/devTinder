const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.Mongo_DB_Connection_String);
};
module.exports={
    connectDB
}