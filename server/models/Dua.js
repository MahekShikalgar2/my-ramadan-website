const mongoose = require('mongoose');

const duaSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['fasting', 'forgiveness', 'laylatul-qadr', 'daily-life', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  arabic: {
    type: String,
    required: true
  },
  transliteration: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  reference: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dua', duaSchema);