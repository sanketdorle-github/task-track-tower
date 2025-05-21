const Column = require('../models/Column');
const mongoose = require('mongoose');

exports.getColumnsByBoardId = async (req, res) => {
  try {
    const { boardId } = req.params;
    
    // Validate that boardId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID format" });
    }
    
    const columns = await Column.find({ boardId });
    res.json(columns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    res.status(500).json({ message: "Error fetching columns" });
  }
};

exports.createColumn = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    
    const newColumn = new Column({
      title,
      boardId,
      tasks: []
    });
    
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error creating column:", error);
    res.status(500).json({ message: "Error creating column" });
  }
};

exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    const column = await Column.findById(id);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }
    
    column.title = title;
    await column.save();
    
    res.json({ id, title });
  } catch (error) {
    console.error("Error updating column:", error);
    res.status(500).json({ message: "Error updating column" });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Column.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Column not found" });
    }
    
    res.json({ id });
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ message: "Error deleting column" });
  }
};

exports.moveColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { sourceIndex, destIndex } = req.body;
    
    // In a production app, we would store an order field for columns
    // and update it accordingly to keep track of column positions
    
    res.json({ columnId, sourceIndex, destIndex });
  } catch (error) {
    console.error("Error moving column:", error);
    res.status(500).json({ message: "Error moving column" });
  }
};
