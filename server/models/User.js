const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
    country: String
  },
  ramadanGoals: {
    quranPages: { type: Number, default: 0 },
    prayers: { type: Number, default: 0 },
    charity: { type: Number, default: 0 },
    goodDeeds: { type: Number, default: 0 }
  },
  dailyChecklist: [{
    date: Date,
    completed: {
      fajr: { type: Boolean, default: false },
      dhuhr: { type: Boolean, default: false },
      asr: { type: Boolean, default: false },
      maghrib: { type: Boolean, default: false },
      isha: { type: Boolean, default: false },
      taraweeh: { type: Boolean, default: false },
      quran: { type: Boolean, default: false },
      charity: { type: Boolean, default: false }
    }
  }],
  tasbeehCounts: [{
    name: String,
    count: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);