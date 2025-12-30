import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { Config } from './components/Config';
import { Quiz } from './components/Quiz';
import { History } from './components/History';
import './App.css';

const AppContent: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="app">
      <Header />
      <StatsBar />
      <main className="app-main">
        {state.currentView === 'config' && <Config />}
        {state.currentView === 'quiz' && <Quiz />}
        {state.currentView === 'history' && <History />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
