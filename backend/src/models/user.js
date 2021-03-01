const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game'
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
