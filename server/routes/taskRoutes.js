
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Task routes
router.post('/:taskId/move', taskController.moveTask);

module.exports = router;
