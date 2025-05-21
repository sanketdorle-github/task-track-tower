
const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Board schema structure
const boardSchema = {
  title: String,
  color: String
};

class Board {
  static getCollection() {
    return db.getDb().collection("boards");
  }

  static async getAll() {
    return await this.getCollection().find({}).toArray();
  }

  static async getById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async create(title, color) {
    // Validate required fields
    if (!title) {
      throw new Error("Board title is required");
    }
    
    const boardDoc = {
      title,
      color: color || "bg-purple-500" // Default color if not provided
    };
    
    const result = await this.getCollection().insertOne(boardDoc);
    return { id: result.insertedId, ...boardDoc };
  }

  static async update(id, title) {
    // Validate required fields
    if (!title) {
      throw new Error("Board title is required");
    }
    
    await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    return await this.getById(id);
  }

  static async delete(id) {
    await this.getCollection().deleteOne({ _id: new ObjectId(id) });
    // Delete all columns associated with this board
    const Column = require('./Column');
    await Column.getCollection().deleteMany({ boardId: id });
    return { id };
  }

  static async generateRandomColor() {
    const colors = [
      "bg-purple-500", "bg-blue-500", "bg-indigo-500", "bg-pink-500",
      "bg-teal-500", "bg-green-500", "bg-amber-500", "bg-red-500"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = Board;
