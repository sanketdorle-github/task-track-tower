
const Column = require('../models/Column');

// Controller for column-related operations
exports.getColumnsByBoardId = async (req, res) => {
  try {
    const { boardId } = req.params;
    const columns = await Column.getAllByBoardId(boardId);
    res.json(columns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    res.status(500).json({ message: "Error fetching columns" });
  }
};

exports.createColumn = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const newColumn = await Column.create(title, boardId);
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
    const result = await Column.update(id, title);
    res.json(result);
  } catch (error) {
    console.error("Error updating column:", error);
    res.status(500).json({ message: "Error updating column" });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Column.delete(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ message: "Error deleting column" });
  }
};

exports.moveColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { sourceIndex, destIndex } = req.body;
    const result = await Column.moveColumn(columnId, sourceIndex, destIndex);
    res.json(result);
  } catch (error) {
    console.error("Error moving column:", error);
    res.status(500).json({ message: "Error moving column" });
  }
};
