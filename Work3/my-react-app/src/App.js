import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (screen === 'quiz') {
      // โหลดคำถามจาก JSON
      fetch('/questions.json')
        .then(response => response.json())
        .then(data => {
          setQuestions(data.questions);
          setUserAnswers(Array(data.questions.length).fill(null)); // เตรียมคำตอบเริ่มต้น
        })
        .catch(error => console.error('Error loading questions:', error));
    }
  }, [screen]);

  const handleStartQuiz = () => setScreen('quiz');

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    const calculatedScore = questions.reduce(
      (total, question, index) => total + (userAnswers[index] === question.answer ? 1 : 0),
      0
    );
    setScore(calculatedScore);
    setScreen('result');
  };

  const handleRestartQuiz = () => {
    setScreen('start');
    setScore(0);
    setUserAnswers([]);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            {screen === 'start' && (
              <div className="text-center">
                <h1>แบบทดสอบออนไลน์</h1>
                <p className="text-muted">ตอบคำถามทั้งหมด 20 ข้อและตรวจคำตอบเมื่อเสร็จสิ้น</p>
                <button onClick={handleStartQuiz} className="btn btn-primary mt-4">
                  เริ่มทำแบบทดสอบ
                </button>
              </div>
            )}

            {screen === 'quiz' && (
              <div>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <h5>{index + 1}. {question.question}</h5>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="form-check">
                        <input
                          type="radio"
                          id={`question-${index}-option-${optIndex}`}
                          name={`question-${index}`}
                          value={option}
                          checked={userAnswers[index] === option}
                          onChange={() => handleAnswerChange(index, option)}
                          className="form-check-input"
                        />
                        <label htmlFor={`question-${index}-option-${optIndex}`} className="form-check-label">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="text-center">
                  <button onClick={handleSubmitQuiz} className="btn btn-success mt-4">
                    ตรวจคำตอบ
                  </button>
                </div>
              </div>
            )}

            {screen === 'result' && (
              <div className="text-center">
                <h2>คะแนนของคุณ: <span>{score}</span>/{questions.length}</h2>
                <button onClick={handleRestartQuiz} className="btn btn-secondary mt-4">
                  ทำแบบทดสอบอีกครั้ง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
