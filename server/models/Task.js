
const mongoose = require('mongoose');
const Column = require('./Column');

class Task {
  static async create(columnId, title, description) {
    // Validate required fields
    if (!columnId) {
      throw new Error("Column ID is required");
    }
    if (!title) {
      throw new Error("Task title is required");
    }
    
    const task = { 
      title, 
      description: description || "" 
    };
    
    // Find column and push new task
    const column = await Column.findById(columnId);
    if (!column) {
      throw new Error("Column not found");
    }
    
    column.tasks.push(task);
    await column.save();
    
    // Return the newly created task with its ID
    const newTask = column.tasks[column.tasks.length - 1];
    return { 
      id: newTask._id.toString(),
      columnId,
      title,
      description: description || ""
    };
  }

  static async update(columnId, taskId, title, description) {
    // Validate required fields
    if (!columnId || !taskId) {
      throw new Error("Column ID and Task ID are required");
    }
    if (!title) {
      throw new Error("Task title is required");
    }
    
    // Find and update the task
    const column = await Column.findById(columnId);
    if (!column) {
      throw new Error("Column not found");
    }
    
    const taskIndex = column.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    column.tasks[taskIndex].title = title;
    column.tasks[taskIndex].description = description || "";
    
    await column.save();
    
    return { id: taskId, columnId, title, description: description || "" };
  }

  static async delete(columnId, taskId) {
    // Validate required fields
    if (!columnId || !taskId) {
      throw new Error("Column ID and Task ID are required");
    }
    
    // Find and remove the task
    const column = await Column.findById(columnId);
    if (!column) {
      throw new Error("Column not found");
    }
    
    const taskIndex = column.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    column.tasks.pull({ _id: taskId });
    await column.save();
    
    return { id: taskId, columnId };
  }

  static async moveTask(taskId, sourceColumnId, destColumnId, sourceIndex, destIndex) {
    // Validate required fields
    if (!taskId || !sourceColumnId || !destColumnId) {
      throw new Error("Task ID, source column ID, and destination column ID are required");
    }
    
    // Find source column
    const sourceColumn = await Column.findById(sourceColumnId);
    if (!sourceColumn) {
      throw new Error("Source column not found");
    }
    
    // Find the task in the source column
    const taskIndex = sourceColumn.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found in source column");
    }
    
    // Get the task we want to move
    const task = sourceColumn.tasks[taskIndex].toObject();
    
    // If moving within the same column
    if (sourceColumnId === destColumnId) {
      // Remove task from its current position
      sourceColumn.tasks.splice(taskIndex, 1);
      
      // Insert task at the destination position
      sourceColumn.tasks.splice(destIndex, 0, task);
      
      // Save the changes
      await sourceColumn.save();
    } else {
      // Moving between different columns
      
      // Find destination column
      const destColumn = await Column.findById(destColumnId);
      if (!destColumn) {
        throw new Error("Destination column not found");
      }
      
      // Remove task from source column
      sourceColumn.tasks.splice(taskIndex, 1);
      await sourceColumn.save();
      
      // Insert task at the destination position in the destination column
      destColumn.tasks.splice(destIndex, 0, task);
      await destColumn.save();
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
