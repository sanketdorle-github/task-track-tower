
const Board = require('../models/Board');

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Error fetching boards" });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const color = Board.generateRandomColor();
    
    const newBoard = new Board({
      title,
      color
    });
    
    await newBoard.save();
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
    
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    
    board.title = title;
    await board.save();
    
    res.json(board);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board" });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the board
    const result = await Board.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Board not found" });
    }
    
    // Delete all columns associated with this board
    const Column = require('../models/Column');
    await Column.deleteMany({ boardId: id });
    
    res.json({ id });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error deleting board" });
  }
};
