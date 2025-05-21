
const Board = require('../models/Board');

// Controller for board-related operations
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.getAll();
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Error fetching boards" });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const color = await Board.generateRandomColor();
    const newBoard = await Board.create(title, color);
    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Error creating board" });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedBoard = await Board.update(id, title);
    res.json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board" });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Board.delete(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error deleting board" });
  }
};
