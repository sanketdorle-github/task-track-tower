
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./config/db');
const { initDummyData } = require('./utils/initData');
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
async function startServer() {
  try {
    // Connect to MongoDB using Mongoose
    await connectToMongoDB();
    
    // Initialize with dummy data
    await initDummyData();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
