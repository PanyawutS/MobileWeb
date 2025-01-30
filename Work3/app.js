import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import questionsData from "./questions.json";

function App() {
  const [screen, setScreen] = useState("start");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);

  // เริ่มต้นเลือกวิชา
  const startQuiz = (subject) => {
    const subjectQuestions = questionsData.subjects.find(
      (s) => s.subject === subject
    );
    setQuestions(subjectQuestions.questions);
    setUserAnswers(Array(subjectQuestions.questions.length).fill(null));
    setSelectedSubject(subject);
    setScreen("quiz");
  };

  // ส่งคำตอบ
  const submitQuiz = () => {
    const calculatedScore = questions.reduce((total, question, index) => {
      return total + (userAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    setScore(calculatedScore);
    setScreen("result");
  };

  // ทำใหม่
  const restartQuiz = () => {
    setScreen("start");
    setScore(0);
    setUserAnswers([]);
    setSelectedSubject("");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            {screen === "start" && (
              <div className="text-center">
                <h1>Online Quiz</h1>
                <p>Select a subject to start the quiz</p>
                {questionsData.subjects.map((subject, index) => (
                  <button
                    key={index}
                    className="btn btn-primary m-2"
                    onClick={() => startQuiz(subject.subject)}
                  >
                    {subject.subject}
                  </button>
                ))}
              </div>
            )}

            {screen === "quiz" && (
              <>
                <h2 className="text-center">Subject: {selectedSubject}</h2>
                <div>
                  {questions.map((question, index) => (
                    <div key={index} className="mb-4">
                      <h5>
                        {index + 1}. {question.question}
                      </h5>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name={`question-${index}`}
                            id={`question-${index}-option-${optIndex}`}
                            value={option}
                            onChange={() => {
                              const newAnswers = [...userAnswers];
                              newAnswers[index] = option;
                              setUserAnswers(newAnswers);
                            }}
                          />
                          <label
                            htmlFor={`question-${index}-option-${optIndex}`}
                            className="form-check-label"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-success mt-4"
                    onClick={submitQuiz}
                    disabled={userAnswers.includes(null)}
                  >
                    Submit Answers
                  </button>
                </div>
              </>
            )}

            {screen === "result" && (
              <div className="text-center">
                <h2>Your Score: {score} / {questions.length}</h2>
                <button className="btn btn-secondary mt-4" onClick={restartQuiz}>
                  Restart Quiz
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
