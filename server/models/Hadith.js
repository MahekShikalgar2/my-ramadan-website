const mongoose = require('mongoose');

const hadithSchema = new mongoose.Schema({
  arabic: String,
  english: String,
  narrator: String,
  source: String,
  category: String,
  date: Date
});

module.exports = mongoose.model('Hadith', hadithSchema);