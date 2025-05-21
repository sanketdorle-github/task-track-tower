
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// Board routes
router.get('/', boardController.getAllBoards);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
