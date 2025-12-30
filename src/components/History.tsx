import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuizSummary } from './QuizSummary';
import './History.css';

export const History: React.FC = () => {
  const { state } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (sessionId: string) => {
    setExpandedId(expandedId === sessionId ? null : sessionId);
  };

  if (state.history.length === 0) {
    return (
      <div className="history-page">
        <h2>Quiz History</h2>
        <div className="no-history">
          <p>No quiz history yet. Complete a quiz to see your results here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h2>Quiz History</h2>
      <div className="history-stats">
        <div className="history-stat">
          <span className="stat-label">Total Quizzes:</span>
          <span className="stat-value">{state.history.length}</span>
        </div>
        <div className="history-stat">
          <span className="stat-label">Average Score:</span>
          <span className="stat-value">
            {(
              state.history.reduce((sum, h) => sum + h.score, 0) / state.history.length
            ).toFixed(0)}
            %
          </span>
        </div>
      </div>

      <div className="history-list">
        {state.history.map(result => (
          <div key={result.sessionId} className="history-item">
            <div className="history-item-header" onClick={() => toggleExpand(result.sessionId)}>
              <div className="history-item-info">
                <span className="history-date">
                  {new Date(result.completedAt).toLocaleString()}
                </span>
                <span className="history-level">Level {result.level}</span>
                <span className="history-categories">
                  {result.categories.slice(0, 3).join(', ')}
                  {result.categories.length > 3 && ` +${result.categories.length - 3}`}
                </span>
              </div>
              <div className="history-item-score">
                <span className="score-text">
                  {result.correctAnswers}/{result.totalQuestions}
                </span>
                <span className="score-percentage">{result.score.toFixed(0)}%</span>
              </div>
              <button className="expand-button">
                {expandedId === result.sessionId ? '▼' : '▶'}
              </button>
            </div>

            {expandedId === result.sessionId && (
              <div className="history-item-details">
                <QuizSummary result={result} showRetakeButton={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
