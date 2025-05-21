
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Board Schema
const BoardSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Board title is required']
  },
  color: {
    type: String,
    default: 'bg-purple-500'
  }
}, { timestamps: true });

// Define static methods
BoardSchema.statics.generateRandomColor = function() {
  const colors = [
    "bg-purple-500", "bg-blue-500", "bg-indigo-500", "bg-pink-500",
    "bg-teal-500", "bg-green-500", "bg-amber-500", "bg-red-500"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;
