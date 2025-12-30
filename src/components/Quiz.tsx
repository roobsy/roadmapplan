import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuizSummary } from './QuizSummary';
import './Quiz.css';

export const Quiz: React.FC = () => {
  const { state, answerQuestion, goToNextQuestion, goToPreviousQuestion, submitQuiz, startQuiz } =
    useApp();
  const [showHint, setShowHint] = useState(false);

  if (!state.currentSession) {
    return (
      <div className="quiz-page">
        <div className="no-quiz">
          <h2>No Active Quiz</h2>
          <p>Please configure and start a quiz from the Config page.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              const enabledCategories = state.config.categories
                .filter(cat => cat.enabled)
                .map(cat => cat.name);
              if (enabledCategories.length > 0) {
                startQuiz(enabledCategories, 1);
              }
            }}
          >
            Quick Start Quiz (Level 1)
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex];
  const currentAnswer = state.currentSession.answers.find(a => a.questionId === currentQuestion.id);
  const isLastQuestion =
    state.currentSession.currentQuestionIndex === state.currentSession.questions.length - 1;
  const canGoNext = currentAnswer !== undefined;
  const canGoPrevious = state.currentSession.currentQuestionIndex > 0;

  const handleAnswerSelect = (answerIndex: number) => {
    answerQuestion(answerIndex);
    setShowHint(false); // Hide hint when answer is selected
  };

  const handleNext = () => {
    if (isLastQuestion && canGoNext) {
      submitQuiz();
    } else {
      goToNextQuestion();
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
    setShowHint(false);
  };


  if (state.currentSession.completed) {
    const result = state.history[0]; // Most recent result
    return (
      <div className="quiz-page">
        <QuizSummary result={result} />

        <div className="quiz-actions-section">
          <h3>What's Next?</h3>
          <div className="quiz-action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => startQuiz(state.currentSession!.categories, state.currentSession!.level)}
            >
              Start New Quiz (Same Categories & Level)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                startQuiz(state.currentSession!.categories, state.currentSession!.level + 1)
              }
            >
              Start New Quiz (Same Categories, Next Level)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                // Go to config to select different categories
                window.location.reload(); // Simple way to reset
              }}
            >
              Start New Quiz (Different Categories & Level)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      {/* Quiz Header Info */}
      <div className="quiz-header-info">
        <div className="quiz-level">Level {state.currentSession.level}</div>
        <div className="quiz-progress">
          Question {state.currentSession.currentQuestionIndex + 1} /{' '}
          {state.currentSession.questions.length}
        </div>
      </div>

      {/* Categories List */}
      <div className="quiz-categories">
        <strong>Categories:</strong> {state.currentSession.categories.join(', ')}
      </div>

      {/* Question Section */}
      <div className="question-card">
        <div className="question-number">
          Question {state.currentSession.currentQuestionIndex + 1}/
          {state.currentSession.questions.length}
        </div>
        <div className="question-text">
          <span className="question-category">[{currentQuestion.category}]:</span>{' '}
          {currentQuestion.text}
        </div>

        {/* Answers */}
        <div className="answers-list">
          {currentQuestion.answers.map((answer, index) => (
            <label
              key={index}
              className={`answer-option ${
                currentAnswer?.selectedAnswerIndex === index ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name="answer"
                checked={currentAnswer?.selectedAnswerIndex === index}
                onChange={() => handleAnswerSelect(index)}
              />
              <span className="answer-text">{answer}</span>
            </label>
          ))}
        </div>

        {/* Hint Section */}
        <div className="hint-section">
          <button className="btn btn-hint" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && <div className="hint-text">{currentQuestion.hint}</div>}
        </div>

        {/* Navigation */}
        <div className="quiz-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canGoNext}
          >
            {isLastQuestion ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
