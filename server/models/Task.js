
const { ObjectId } = require('mongodb');
const db = require('../config/db');

class Task {
  static async create(columnId, title, description) {
    const task = { 
      id: new ObjectId().toString(),
      title, 
      description 
    };
    
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId) },
      { $push: { tasks: task } }
    );
    
    return { ...task, columnId };
  }

  static async update(columnId, taskId, title, description) {
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId), "tasks.id": taskId },
      { $set: { "tasks.$.title": title, "tasks.$.description": description } }
    );
    
    return { id: taskId, columnId, title, description };
  }

  static async delete(columnId, taskId) {
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId) },
      { $pull: { tasks: { id: taskId } } }
    );
    
    return { id: taskId, columnId };
  }

  static async moveTask(taskId, sourceColumnId, destColumnId, sourceIndex, destIndex) {
    // Find source column
    const sourceColumn = await db.collection("columns").findOne({ _id: new ObjectId(sourceColumnId) });
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
      await db.collection("columns").updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $pull: { tasks: { id: taskId } } }
      );
      
      // Find the column again after removing the task
      const updatedColumn = await db.collection("columns").findOne({ _id: new ObjectId(sourceColumnId) });
      const newTasks = updatedColumn.tasks;
      
      // Insert task at the destination position
      newTasks.splice(destIndex, 0, task);
      
      // Update the column with the new task order
      await db.collection("columns").updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $set: { tasks: newTasks } }
      );
    } else {
      // Moving between different columns
      
      // Remove task from source column
      await db.collection("columns").updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $pull: { tasks: { id: taskId } } }
      );
      
      // Find destination column
      const destColumn = await db.collection("columns").findOne({ _id: new ObjectId(destColumnId) });
      if (!destColumn) {
        // If destination column not found, put the task back in the source column
        await db.collection("columns").updateOne(
          { _id: new ObjectId(sourceColumnId) },
          { $push: { tasks: task } }
        );
        throw new Error("Destination column not found");
      }
      
      // Update the task's columnId
      task.columnId = destColumnId;
      
      // Insert task at the destination position in the destination column
      const destTasks = destColumn.tasks;
      destTasks.splice(destIndex, 0, task);
      
      // Update the destination column with the new tasks array
      await db.collection("columns").updateOne(
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
