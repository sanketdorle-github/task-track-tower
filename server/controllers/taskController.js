
const Task = require('../models/Task');

// Controller for task-related operations
exports.createTask = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description } = req.body;
    const newTask = await Task.create(columnId, title, description);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { columnId, taskId } = req.params;
    const { title, description } = req.body;
    const updatedTask = await Task.update(columnId, taskId, title, description);
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { columnId, taskId } = req.params;
    const result = await Task.delete(columnId, taskId);
    res.json(result);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};

exports.moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { sourceColumnId, destColumnId, sourceIndex, destIndex } = req.body;
    const result = await Task.moveTask(taskId, sourceColumnId, destColumnId, sourceIndex, destIndex);
    res.json(result);
  } catch (error) {
    console.error("Error moving task:", error);
    res.status(500).json({ message: error.message || "Error moving task" });
  }
};
