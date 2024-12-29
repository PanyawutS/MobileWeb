import React from 'react';

const Question = ({ question, options, selectedOption, onOptionSelect }) => {
    return (
        <div className="question-container">
            <h2>{question}</h2>
            <div className="options">
                {options.map((option, index) => (
                    <div key={index} className="option">
                        <input
                            type="radio"
                            id={`option${index}`}
                            name="quiz-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => onOptionSelect(option)}
                        />
                        <label htmlFor={`option${index}`}>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Question;