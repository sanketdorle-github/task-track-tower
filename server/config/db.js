
const { MongoClient } = require('mongodb');

// Define schema structure - these are documentation only and not enforced by MongoDB
// (MongoDB is schema-less but we document the expected structure)
const schemas = {
  boards: {
    _id: "ObjectId",
    title: "String",
    color: "String"
  },
  columns: {
    _id: "ObjectId",
    title: "String", 
    boardId: "String",
    tasks: "Array of task objects"
  },
  tasks: {
    id: "String (ObjectId as string)",
    title: "String",
    description: "String"
  }
};

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
  getDb: () => db,
  schemas // Export schema documentation
};
