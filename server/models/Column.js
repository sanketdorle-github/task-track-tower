const { ObjectId } = require('mongodb');
const db = require('../config/db');

class Column {
  static async getAllByBoardId(boardId) {
    return await db.collection("columns").find({ boardId }).toArray();
  }

  static async getById(id) {
    return await db.collection("columns").findOne({ _id: new ObjectId(id) });
  }

  static async create(title, boardId) {
    const result = await db.collection("columns").insertOne({
      title,
      boardId,
      tasks: []
    });
    return await this.getById(result.insertedId);
  }

  static async update(id, title) {
    await db.collection("columns").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    return { id, title };
  }

  static async delete(id) {
    await db.collection("columns").deleteOne({ _id: new ObjectId(id) });
    return { id };
  }

  static async moveColumn(columnId, sourceIndex, destIndex) {
    // In a production app, we would store an order field for columns
    // and update it accordingly to keep track of column positions
    return { columnId, sourceIndex, destIndex };
  }
}

module.exports = Column;
