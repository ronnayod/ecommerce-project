// routes/game.js
const express = require('express');
const router = express.Router();
const GamePlayer = require('../models/GamePlayer');
const Question = require('../models/Question');

// Get player data and calculate lives
router.get('/player/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let player = await GamePlayer.findOne({ userId });

    if (!player) {
      player = new GamePlayer({ userId });
      await player.save();
    }

    // คำนวณหัวใจที่กู้คืน
    const maxLives = 6;
    const recoveryInterval = 60 * 60 * 1000; // 1 ชั่วโมง
    const now = new Date();
    let lives = player.lives;

    if (player.lastLifeLost && lives < maxLives) {
      const timeDiff = now - new Date(player.lastLifeLost);
      const livesToRecover = Math.floor(timeDiff / recoveryInterval);
      if (livesToRecover > 0) {
        lives = Math.min(maxLives, lives + livesToRecover);
        player.lastLifeLost = new Date(now - (timeDiff % recoveryInterval));
        player.lives = lives;
        await player.save();
      }
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get random 10 questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update player data after answering
router.post('/player/update', async (req, res) => {
  try {
    const { userId, lives, score, lastLifeLost, correctAnswers, currentLevel } = req.body;

    const player = await GamePlayer.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // อัปเดตข้อมูลพื้นฐาน
    player.lives = lives;
    player.score = score;
    player.lastLifeLost = lastLifeLost ? new Date(lastLifeLost) : null;
    player.currentLevel = currentLevel;

    // ตรวจสอบเงื่อนไขปลดล็อกด่าน
    const requiredCorrectAnswers = 3; // ต้องตอบถูกมากกว่า 3 ข้อ
    if (correctAnswers > requiredCorrectAnswers && !player.unlockedLevels.includes(currentLevel + 1)) {
      player.unlockedLevels.push(currentLevel + 1);
      player.currentLevel = currentLevel + 1; // ไปด่านถัดไป
    }

    await player.save();
    res.json({ message: 'Player data updated', player });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;