
const mongoose = require('mongoose');

// MongoDB connection
const uri = "mongodb://localhost:27017/boardsApp";

// Database connection function
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB using Mongoose");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = {
  connectToMongoDB,
  connection: mongoose.connection
};
