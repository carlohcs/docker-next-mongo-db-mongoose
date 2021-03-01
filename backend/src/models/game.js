const mongoose = require('mongoose');
const { Schema } = mongoose;
const enums = require('./enums');

// https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship
const GameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(enums.game.status)
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ]
});

module.exports = mongoose.model('Game', GameSchema);
