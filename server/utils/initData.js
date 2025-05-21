
const { ObjectId } = require('mongodb');

async function initDummyData(db) {
  try {
    // Check if boards collection is empty
    const boardsCount = await db.collection("boards").countDocuments();
    if (boardsCount === 0) {
      // Insert dummy boards
      const boardsResult = await db.collection("boards").insertMany([
        { title: "Project Alpha", color: "bg-purple-500" },
        { title: "Marketing Campaign", color: "bg-blue-500" },
        { title: "Website Redesign", color: "bg-indigo-500" },
        { title: "Personal Tasks", color: "bg-pink-500" }
      ]);
      
      console.log("Inserted dummy boards");
      
      // Get the first board's ID
      const firstBoardId = boardsResult.insertedIds[0];
      
      // Insert dummy columns for the first board
      const columnsResult = await db.collection("columns").insertMany([
        {
          title: "To Do",
          boardId: firstBoardId.toString(),
          tasks: [
            { id: new ObjectId().toString(), title: "Research competitors", description: "Look at similar products and identify strengths and weaknesses" },
            { id: new ObjectId().toString(), title: "Create wireframes", description: "Design preliminary wireframes for key screens" },
            { id: new ObjectId().toString(), title: "Setup development environment" }
          ]
        },
        {
          title: "In Progress",
          boardId: firstBoardId.toString(),
          tasks: [
            { id: new ObjectId().toString(), title: "Implement authentication", description: "Create login and registration flows" },
            { id: new ObjectId().toString(), title: "Build dashboard UI" }
          ]
        },
        {
          title: "Review",
          boardId: firstBoardId.toString(),
          tasks: [
            { id: new ObjectId().toString(), title: "Code review: API endpoints", description: "Review and optimize API endpoints" }
          ]
        },
        {
          title: "Done",
          boardId: firstBoardId.toString(),
          tasks: [
            { id: new ObjectId().toString(), title: "Setup project repo", description: "Initialize repository and configure CI/CD" },
            { id: new ObjectId().toString(), title: "Create project plan" }
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
