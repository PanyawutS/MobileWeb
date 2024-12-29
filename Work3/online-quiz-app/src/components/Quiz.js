import React, { useState, useEffect } from 'react';
import Question from './Question';
import Result from './Result';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        fetch('/quiz-data.json')
            .then(response => response.json())
            .then(data => setQuestions(data.questions));
    }, []);

    const handleAnswerSelect = (answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = answer;
        setUserAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleSubmit = () => {
        setQuizCompleted(true);
    };

    const calculateScore = () => {
        return userAnswers.reduce((score, answer, index) => {
            return score + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
    };

    if (quizCompleted) {
        return <Result score={calculateScore()} totalQuestions={questions.length} />;
    }

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Question
                question={questions[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
            />
            {currentQuestionIndex < questions.length - 1 ? (
                <button onClick={handleNextQuestion}>Next</button>
            ) : (
                <button onClick={handleSubmit}>Submit</button>
            )}
        </div>
    );
};

export default Quiz;