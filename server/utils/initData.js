
const mongoose = require('mongoose');
const Board = require('../models/Board');
const Column = require('../models/Column');

async function initDummyData() {
  try {
    // Check if boards collection is empty
    const boardsCount = await Board.countDocuments();
    if (boardsCount === 0) {
      // Insert dummy boards
      const boards = await Board.create([
        { title: "Project Alpha", color: "bg-purple-500" },
        { title: "Marketing Campaign", color: "bg-blue-500" },
        { title: "Website Redesign", color: "bg-indigo-500" },
        { title: "Personal Tasks", color: "bg-pink-500" }
      ]);
      
      console.log("Inserted dummy boards");
      
      // Get the first board's ID
      const firstBoardId = boards[0]._id;
      
      // Insert dummy columns for the first board
      await Column.create([
        {
          title: "To Do",
          boardId: firstBoardId,
          tasks: [
            { title: "Research competitors", description: "Look at similar products and identify strengths and weaknesses" },
            { title: "Create wireframes", description: "Design preliminary wireframes for key screens" },
            { title: "Setup development environment", description: "" }
          ]
        },
        {
          title: "In Progress",
          boardId: firstBoardId,
          tasks: [
            { title: "Implement authentication", description: "Create login and registration flows" },
            { title: "Build dashboard UI", description: "" }
          ]
        },
        {
          title: "Review",
          boardId: firstBoardId,
          tasks: [
            { title: "Code review: API endpoints", description: "Review and optimize API endpoints" }
          ]
        },
        {
          title: "Done",
          boardId: firstBoardId,
          tasks: [
            { title: "Setup project repo", description: "Initialize repository and configure CI/CD" },
            { title: "Create project plan", description: "" }
          ]
        }
      ]);
      
      console.log("Inserted dummy columns");
    }
  } catch (error) {
    console.error("Error initializing dummy data:", error);
    throw error;
  }
}

module.exports = { initDummyData };
