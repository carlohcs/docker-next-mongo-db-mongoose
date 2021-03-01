const mongoose = require('mongoose');
const { Schema } = mongoose;
const enums = require('./enums')

const ImageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(enums.image.type),
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
});

module.exports = mongoose.model('Image', ImageSchema);
