const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Database connection function
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("boardsApp");
    
    // Create collections if they don't exist
    await db.createCollection("boards");
    await db.createCollection("columns");
    
    // Initialize with dummy data if collections are empty
    const boardsCount = await db.collection("boards").countDocuments();
    if (boardsCount === 0) {
      await initDummyData();
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Initialize with dummy data
async function initDummyData() {
  try {
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
  } catch (error) {
    console.error("Error initializing dummy data:", error);
  }
}

// API Routes
// Get all boards
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await db.collection("boards").find({}).toArray();
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Error fetching boards" });
  }
});

// Create board
app.post('/api/boards', async (req, res) => {
  try {
    const { title } = req.body;
    
    // Generate a random color
    const colors = [
      "bg-purple-500", "bg-blue-500", "bg-indigo-500", "bg-pink-500",
      "bg-teal-500", "bg-green-500", "bg-amber-500", "bg-red-500"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const result = await db.collection("boards").insertOne({ title, color });
    res.status(201).json({ id: result.insertedId, title, color });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Error creating board" });
  }
});

// Update board
app.put('/api/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    await db.collection("boards").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    
    const updatedBoard = await db.collection("boards").findOne({ _id: new ObjectId(id) });
    res.json(updatedBoard);
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board" });
  }
});

// Delete board
app.delete('/api/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the board
    await db.collection("boards").deleteOne({ _id: new ObjectId(id) });
    
    // Delete all columns associated with this board
    await db.collection("columns").deleteMany({ boardId: id });
    
    res.json({ id });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ message: "Error deleting board" });
  }
});

// Get columns by board ID
app.get('/api/boards/:boardId/columns', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const columns = await db.collection("columns")
      .find({ boardId: boardId })
      .toArray();
    
    res.json(columns);
  } catch (error) {
    console.error("Error fetching columns:", error);
    res.status(500).json({ message: "Error fetching columns" });
  }
});

// Create column
app.post('/api/columns', async (req, res) => {
  try {
    const { title, boardId } = req.body;
    
    const result = await db.collection("columns").insertOne({
      title,
      boardId,
      tasks: []
    });
    
    const newColumn = await db.collection("columns").findOne({ _id: result.insertedId });
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error creating column:", error);
    res.status(500).json({ message: "Error creating column" });
  }
});

// Update column
app.put('/api/columns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    await db.collection("columns").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    
    res.json({ id, title });
  } catch (error) {
    console.error("Error updating column:", error);
    res.status(500).json({ message: "Error updating column" });
  }
});

// Delete column
app.delete('/api/columns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection("columns").deleteOne({ _id: new ObjectId(id) });
    
    res.json({ id });
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ message: "Error deleting column" });
  }
});

// Create task
app.post('/api/columns/:columnId/tasks', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description } = req.body;
    
    const task = { 
      id: new ObjectId().toString(),
      title, 
      description 
    };
    
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId) },
      { $push: { tasks: task } }
    );
    
    res.status(201).json({ ...task, columnId });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update task
app.put('/api/columns/:columnId/tasks/:taskId', async (req, res) => {
  try {
    const { columnId, taskId } = req.params;
    const { title, description } = req.body;
    
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId), "tasks.id": taskId },
      { $set: { "tasks.$.title": title, "tasks.$.description": description } }
    );
    
    res.json({ id: taskId, columnId, title, description });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete task
app.delete('/api/columns/:columnId/tasks/:taskId', async (req, res) => {
  try {
    const { columnId, taskId } = req.params;
    
    await db.collection("columns").updateOne(
      { _id: new ObjectId(columnId) },
      { $pull: { tasks: { id: taskId } } }
    );
    
    res.json({ id: taskId, columnId });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
});

// Move task between columns
app.post('/api/tasks/:taskId/move', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { sourceColumnId, destColumnId, sourceIndex, destIndex } = req.body;
    
    // Get the source column and task
    const sourceColumn = await db.collection("columns").findOne({ _id: new ObjectId(sourceColumnId) });
    if (!sourceColumn) {
      return res.status(404).json({ message: "Source column not found" });
    }
    
    // Find the task in the source column
    const taskIndex = sourceColumn.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found in source column" });
    }
    
    const task = sourceColumn.tasks[taskIndex];
    
    // If moving within the same column
    if (sourceColumnId === destColumnId) {
      // Reorder tasks in the column
      const newTasks = [...sourceColumn.tasks];
      newTasks.splice(taskIndex, 1);
      newTasks.splice(destIndex, 0, task);
      
      await db.collection("columns").updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $set: { tasks: newTasks } }
      );
    } else {
      // Remove task from source column
      await db.collection("columns").updateOne(
        { _id: new ObjectId(sourceColumnId) },
        { $pull: { tasks: { id: taskId } } }
      );
      
      // Get destination column
      const destColumn = await db.collection("columns").findOne({ _id: new ObjectId(destColumnId) });
      if (!destColumn) {
        return res.status(404).json({ message: "Destination column not found" });
      }
      
      // Add task to destination column at the right position
      const newTasks = [...destColumn.tasks];
      newTasks.splice(destIndex, 0, task);
      
      await db.collection("columns").updateOne(
        { _id: new ObjectId(destColumnId) },
        { $set: { tasks: newTasks } }
      );
    }
    
    res.json({
      taskId,
      sourceColumnId,
      destColumnId,
      sourceIndex,
      destIndex
    });
  } catch (error) {
    console.error("Error moving task:", error);
    res.status(500).json({ message: "Error moving task" });
  }
});

// Move column (reorder columns)
app.post('/api/columns/:columnId/move', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { sourceIndex, destIndex } = req.body;
    
    // Find the column to be moved
    const column = await db.collection("columns").findOne({ _id: new ObjectId(columnId) });
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }
    
    // In a production app, we would store an order field for columns
    // and update it accordingly to keep track of column positions
    // For this demo, we'll just return success
    
    res.json({ columnId, sourceIndex, destIndex });
  } catch (error) {
    console.error("Error moving column:", error);
    res.status(500).json({ message: "Error moving column" });
  }
});

// Start the server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
