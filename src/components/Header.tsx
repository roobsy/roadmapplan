import React from 'react';
import { useApp } from '../context/AppContext';
import './Header.css';

export const Header: React.FC = () => {
  const { state, setCurrentView } = useApp();

  return (
    <header className="app-header">
      <h1 className="app-title">Quiz Master</h1>
      <nav className="app-nav">
        <button
          className={`nav-button ${state.currentView === 'config' ? 'active' : ''}`}
          onClick={() => setCurrentView('config')}
        >
          Config
        </button>
        <button
          className={`nav-button ${state.currentView === 'quiz' ? 'active' : ''}`}
          onClick={() => setCurrentView('quiz')}
        >
          Start Quiz
        </button>
        <button
          className={`nav-button ${state.currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
        >
          History
        </button>
      </nav>
    </header>
  );
};
