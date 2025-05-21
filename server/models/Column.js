
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task Schema (embedded in Column)
const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required']
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Column Schema
const ColumnSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Column title is required']
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: [true, 'Board ID is required']
  },
  tasks: [TaskSchema]
}, { timestamps: true });

const Column = mongoose.model('Column', ColumnSchema);

module.exports = Column;
