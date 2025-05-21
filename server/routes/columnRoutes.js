
const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');
const taskController = require('../controllers/taskController');

// Column routes
router.get('/boards/:boardId/columns', columnController.getColumnsByBoardId);
router.post('/', columnController.createColumn);
router.put('/:id', columnController.updateColumn);
router.delete('/:id', columnController.deleteColumn);
router.post('/:columnId/move', columnController.moveColumn);

// Task routes attached to columns
router.post('/:columnId/tasks', taskController.createTask);
router.put('/:columnId/tasks/:taskId', taskController.updateTask);
router.delete('/:columnId/tasks/:taskId', taskController.deleteTask);

module.exports = router;
