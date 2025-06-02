// src/components/Game.js (React)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(6);
  const [lastLifeLost, setLastLifeLost] = useState(null);
  const [error, setError] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // ด่านที่ปลดล็อก
  const [correctAnswers, setCorrectAnswers] = useState(0); // นับคำตอบที่ถูก
  const [showLevelSelection, setShowLevelSelection] = useState(true); // แสดงหน้าเลือกด่าน
  const userId = 'user123'; // ควรมาจากระบบ auth

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const playerResponse = await axios.get(`http://localhost:5000/api/game/player/${userId}`);
      const { lives, score, lastLifeLost, currentLevel, unlockedLevels } = playerResponse.data;
      setLives(lives);
      setScore(score);
      setLastLifeLost(lastLifeLost);
      setCurrentLevel(currentLevel);
      setUnlockedLevels(unlockedLevels);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    }
  };

  const startLevel = async (level) => {
    try {
      const questionsResponse = await axios.get('http://localhost:5000/api/game/questions');
      setQuestions(questionsResponse.data);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0); // รีเซ็ตจำนวนคำตอบที่ถูก
      setShowLevelSelection(false);
      setCurrentLevel(level);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching questions:', err);
    }
  };

  const handleAnswer = async (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    let newCorrectAnswers = correctAnswers;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      newCorrectAnswers += 1;
      setCorrectAnswers(newCorrectAnswers);
      alert('ถูก!');
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setLastLifeLost(new Date());
      try {
        await axios.post('http://localhost:5000/api/game/player/update', {
          userId,
          lives: newLives,
          score,
          lastLifeLost: new Date(),
          correctAnswers: newCorrectAnswers,
          currentLevel,
        });
        if (newLives <= 0) {
          alert('เกมจบ! หัวใจหมด');
          setShowLevelSelection(true); // กลับไปหน้าเลือกด่าน
          return;
        }
        alert(`ผิด! เหลือ ${newLives} ดวง`);
      } catch (err) {
        setError(err.message);
        console.error('Error updating player:', err);
      }
    }

    if (currentQuestionIndex + 1 < 10) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // จบด่าน ตรวจสอบเงื่อนไขปลดล็อก
      try {
        await axios.post('http://localhost:5000/api/game/player/update', {
          userId,
          lives,
          score,
          lastLifeLost,
          correctAnswers: newCorrectAnswers,
          currentLevel,
        });
        const playerResponse = await axios.get(`http://localhost:5000/api/game/player/${userId}`);
        setUnlockedLevels(playerResponse.data.unlockedLevels);
        setCurrentLevel(playerResponse.data.currentLevel);
        alert(`จบด่าน ${currentLevel}! คุณตอบถูก ${newCorrectAnswers} ข้อ`);
        setShowLevelSelection(true); // กลับไปหน้าเลือกด่าน
      } catch (err) {
        setError(err.message);
        console.error('Error updating player:', err);
      }
    }
  };

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error}</div>;
  }

  if (lives <= 0) {
    return (
      <div>
        <h1>เกมจบ!</h1>
        <p>หัวใจของคุณหมดแล้ว รอหัวใจกู้คืน (1 ดวงทุก 1 ชั่วโมง)</p>
        <Link to="/">
          <button className="btn btn-primary mt-3">กลับหน้าหลัก</button>
        </Link>
      </div>
    );
  }

  if (showLevelSelection) {
    return (
      <div className="container mt-5 text-center">
        <h1>เลือกด่าน</h1>
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level}>
            <button
              className="btn btn-primary mt-3"
              onClick={() => startLevel(level)}
              disabled={!unlockedLevels.includes(level)}
            >
              ด่าน {level} {unlockedLevels.includes(level) ? '' : '(ถูกล็อก)'}
            </button>
          </div>
        ))}
        <Link to="/">
          <button className="btn btn-secondary mt-3">กลับหน้าหลัก</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h1>เกมตอบคำถาม - ด่าน {currentLevel}</h1>
      <p>คะแนน: {score}</p>
      <p>หัวใจ: {'❤️'.repeat(lives)}</p>
      <p>ตอบถูก: {correctAnswers} ข้อ</p>
      {questions.length > 0 && (
        <div>
          <h3>คำถามที่ {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}</h3>
          <div>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <button
                key={idx}
                className="btn btn-outline-primary m-2"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className="btn btn-secondary mt-3"
        onClick={() => setShowLevelSelection(true)}
      >
        กลับไปเลือกด่าน
      </button>
    </div>
  );
};

export default Game;