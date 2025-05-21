
const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Column schema structure
const columnSchema = {
  title: String,
  boardId: String,
  tasks: Array // Array of task objects
};

// Task schema structure (embedded in column)
const taskSchema = {
  id: String,
  title: String,
  description: String
};

class Column {
  static getCollection() {
    return db.getDb().collection("columns");
  }

  static async getAllByBoardId(boardId) {
    // Validate boardId
    if (!boardId) {
      throw new Error("Board ID is required");
    }
    
    return await this.getCollection().find({ boardId }).toArray();
  }

  static async getById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async create(title, boardId) {
    // Validate required fields
    if (!title) {
      throw new Error("Column title is required");
    }
    if (!boardId) {
      throw new Error("Board ID is required");
    }
    
    const columnDoc = {
      title,
      boardId,
      tasks: []
    };
    
    const result = await this.getCollection().insertOne(columnDoc);
    return await this.getById(result.insertedId);
  }

  static async update(id, title) {
    // Validate required fields
    if (!title) {
      throw new Error("Column title is required");
    }
    
    await this.getCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    return { id, title };
  }

  static async delete(id) {
    await this.getCollection().deleteOne({ _id: new ObjectId(id) });
    return { id };
  }

  static async moveColumn(columnId, sourceIndex, destIndex) {
    // In a production app, we would store an order field for columns
    // and update it accordingly to keep track of column positions
    return { columnId, sourceIndex, destIndex };
  }
}

module.exports = Column;
