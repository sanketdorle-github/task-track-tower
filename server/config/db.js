
const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Database connection function
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("boardsApp");
    
    // Create collections if they don't exist
    await db.createCollection("boards");
    await db.createCollection("columns");
    
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = {
  connectToMongoDB,
  getDb: () => db
};
