// models/GamePlayer.js
const mongoose = require('mongoose');

const gamePlayerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  lives: { type: Number, default: 6 },
  score: { type: Number, default: 0 },
  lastLifeLost: { type: Date, default: null },
  currentLevel: { type: Number, default: 1 }, // ด่านปัจจุบัน
  unlockedLevels: { type: [Number], default: [1] }, // รายการด่านที่ปลดล็อกแล้ว (เริ่มต้นที่ด่าน 1)
});

module.exports = mongoose.model('GamePlayer', gamePlayerSchema);