import React from 'react';

const Result = ({ score, totalQuestions, restartQuiz }) => {
    return (
        <div className="result-container">
            <h1>Your Score</h1>
            <p>
                You scored {score} out of {totalQuestions}.
            </p>
            <p>
                {score / totalQuestions >= 0.5 ? 'Great job!' : 'Better luck next time!'}
            </p>
            <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
    );
};

export default Result;