import React from 'react';
import { useApp } from '../context/AppContext';
import './StatsBar.css';

export const StatsBar: React.FC = () => {
  const { getQuestionBankStats } = useApp();
  const stats = getQuestionBankStats();

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Total Questions:</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Used:</span>
        <span className="stat-value">{stats.used}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Never Used:</span>
        <span className="stat-value">{stats.neverUsed}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Correct Answers:</span>
        <span className="stat-value correct">{stats.recentCorrect}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Wrong Answers:</span>
        <span className="stat-value wrong">{stats.recentWrong}</span>
      </div>
    </div>
  );
};
