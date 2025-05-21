
const { MongoClient, ObjectId } = require('mongodb');
const db = require('../config/db');

class Board {
  static async getAll() {
    return await db.collection("boards").find({}).toArray();
  }

  static async getById(id) {
    return await db.collection("boards").findOne({ _id: new ObjectId(id) });
  }

  static async create(title, color) {
    const result = await db.collection("boards").insertOne({ title, color });
    return { id: result.insertedId, title, color };
  }

  static async update(id, title) {
    await db.collection("boards").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    return await this.getById(id);
  }

  static async delete(id) {
    await db.collection("boards").deleteOne({ _id: new ObjectId(id) });
    // Delete all columns associated with this board
    await db.collection("columns").deleteMany({ boardId: id });
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
