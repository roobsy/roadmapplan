import React from 'react';
import type { QuizResult } from '../types';
import { useApp } from '../context/AppContext';
import './QuizSummary.css';

interface QuizSummaryProps {
  result: QuizResult;
  showRetakeButton?: boolean;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({ result, showRetakeButton = true }) => {
  const { retakeQuiz } = useApp();

  const getAnswerClass = (isCorrect: boolean) => {
    return isCorrect ? 'correct' : 'wrong';
  };

  return (
    <div className="quiz-summary">
      <div className="summary-header">
        <h2>Quiz Results</h2>
        <div className="summary-stats">
          <div className="stat-large">
            <span className="stat-value">{result.correctAnswers}</span>
            <span className="stat-label">/ {result.totalQuestions}</span>
          </div>
          <div className="stat-description">Correct Answers</div>
          <div className="score-percentage">{result.score.toFixed(0)}%</div>
        </div>
      </div>

      {showRetakeButton && (
        <button
          className="btn btn-primary retake-button"
          onClick={() => retakeQuiz(result.sessionId)}
        >
          Retake This Quiz
        </button>
      )}

      <div className="results-list">
        <h3>Question-by-Question Results</h3>
        {result.questions.map((question, index) => {
          const answer = result.answers.find(a => a.questionId === question.id);

          return (
            <div key={question.id} className="result-item">
              <div className="result-header">
                <span className="result-number">Question {index + 1}</span>
                <span className={`result-badge ${getAnswerClass(answer?.isCorrect || false)}`}>
                  {answer?.isCorrect ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>

              <div className="result-question">
                <span className="result-category">[{question.category}]</span> {question.text}
              </div>

              <div className="result-answers">
                <div className="all-answers">
                  {question.answers.map((ans, idx) => {
                    const isUserAnswer = answer?.selectedAnswerIndex === idx;
                    const isCorrectAnswer = idx === question.correctAnswerIndex;

                    let answerClass = 'answer-item';
                    if (isCorrectAnswer) answerClass += ' correct-answer';
                    if (isUserAnswer && !isCorrectAnswer) answerClass += ' user-wrong-answer';
                    if (isUserAnswer && isCorrectAnswer) answerClass += ' user-correct-answer';

                    return (
                      <div key={idx} className={answerClass}>
                        {ans}
                        {isUserAnswer && <span className="badge">Your Answer</span>}
                        {isCorrectAnswer && <span className="badge correct">Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {result.retakes && result.retakes.length > 0 && (
        <div className="retakes-section">
          <h3>Previous Attempts</h3>
          {result.retakes.map((retake, index) => (
            <div key={retake.retakeId} className="retake-item">
              <span>Attempt {index + 1}:</span>
              <span>
                {retake.correctAnswers}/{result.totalQuestions}
              </span>
              <span>{retake.score.toFixed(0)}%</span>
              <span>{new Date(retake.completedAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
