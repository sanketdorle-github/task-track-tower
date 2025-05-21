
const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Task schema structure (stored as embedded documents in columns collection)
const taskSchema = {
  id: String,
  title: String,
  description: String
};

class Task {
  static getCollection() {
    return db.getDb().collection("columns");
  }

  static async create(columnId, title, description) {
    // Validate required fields
    if (!columnId) {
      throw new Error("Column ID is required");
    }
    if (!title) {
      throw new Error("Task title is required");
    }
    
    const task = { 
      id: new ObjectId().toString(),
      title, 
      description: description || "" 
    };
    
    await this.getCollection().updateOne(
      { _id: new ObjectId(columnId) },
      { $push: { tasks: task } }
    );
    
    return { ...task, columnId };
  }

  static async update(columnId, taskId, title, description) {
    // Validate required fields
    if (!columnId || !taskId) {
      throw new Error("Column ID and Task ID are required");
    }
    if (!title) {
      throw new Error("Task title is required");
    }
    
    await this.getCollection().updateOne(
      { _id: new ObjectId(columnId), "tasks.id": taskId },
      { $set: { 
        "tasks.$.title": title, 
        "tasks.$.description": description || "" 
      }}
    );
    
    return { id: taskId, columnId, title, description };
  }

  static async delete(columnId, taskId) {
    // Validate required fields
    if (!columnId || !taskId) {
      throw new Error("Column ID and Task ID are required");
    }
    
    await this.getCollection().updateOne(
      { _id: new ObjectId(columnId) },
      { $pull: { tasks: { id: taskId } } }
    );
    
    return { id: taskId, columnId };
  }

  static async moveTask(taskId, sourceColumnId, destColumnId, sourceIndex, destIndex) {
    // Validate required fields
    if (!taskId || !sourceColumnId || !destColumnId) {
      throw new Error("Task ID, source column ID, and destination column ID are required");
    }
    
    // Find source column
    const sourceColumn = await this.getCollection().findOne({ _id: new ObjectId(sourceColumnId) });
    if (!sourceColumn) {
      throw new Error("Source column not found");
    }
    
    // Find the task in the source column
    const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found in source column");
    }
    
    // Get the task we want to move
    const task = sourceColumn.tasks[taskIndex];
    
    // If moving within the same column
    if (sourceColumnId === destColumnId) {
      // Remove task from its current position
      await this.getCollection().updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $pull: { tasks: { id: taskId } } }
      );
      
      // Find the column again after removing the task
      const updatedColumn = await this.getCollection().findOne({ _id: new ObjectId(sourceColumnId) });
      const newTasks = updatedColumn.tasks;
      
      // Insert task at the destination position
      newTasks.splice(destIndex, 0, task);
      
      // Update the column with the new task order
      await this.getCollection().updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $set: { tasks: newTasks } }
      );
    } else {
      // Moving between different columns
      
      // Remove task from source column
      await this.getCollection().updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $pull: { tasks: { id: taskId } } }
      );
      
      // Find destination column
      const destColumn = await this.getCollection().findOne({ _id: new ObjectId(destColumnId) });
      if (!destColumn) {
        // If destination column not found, put the task back in the source column
        await this.getCollection().updateOne(
          { _id: new ObjectId(sourceColumnId) },
          { $push: { tasks: task } }
        );
        throw new Error("Destination column not found");
      }
      
      // Update the task's columnId if you need to track it within the task object
      task.columnId = destColumnId;
      
      // Insert task at the destination position in the destination column
      const destTasks = destColumn.tasks || [];
      destTasks.splice(destIndex, 0, task);
      
      // Update the destination column with the new tasks array
      await this.getCollection().updateOne(
        { _id: new ObjectId(destColumnId) },
        { $set: { tasks: destTasks } }
      );
    }
    
    return {
      taskId,
      sourceColumnId,
      destColumnId,
      sourceIndex,
      destIndex
    };
  }
}

module.exports = Task;
