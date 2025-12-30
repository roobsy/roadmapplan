import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { QuizConfig } from '../types';
import './Config.css';

export const Config: React.FC = () => {
  const { state, updateConfig, startQuiz } = useApp();
  const [config, setConfig] = useState<QuizConfig>(state.config);
  const [selectedLevel, setSelectedLevel] = useState(1);

  const handleCategoryToggle = (categoryId: string) => {
    const updatedCategories = config.categories.map(cat =>
      cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
    );
    setConfig({ ...config, categories: updatedCategories });
  };

  const handleQuestionsPerRoundChange = (value: number) => {
    setConfig({ ...config, questionsPerRound: value });
  };

  const handleDistributionChange = (distribution: 'even' | 'random' | 'weighted') => {
    setConfig({ ...config, questionDistribution: distribution });
  };

  const handleWeightChange = (
    weight: 'neverUsedWeight' | 'wronglyAnsweredWeight' | 'leastUsedWeight',
    value: number
  ) => {
    setConfig({
      ...config,
      scoringWeights: {
        ...config.scoringWeights,
        [weight]: value,
      },
    });
  };

  const handleSaveConfig = () => {
    updateConfig(config);
    alert('Configuration saved!');
  };

  const handleStartQuiz = () => {
    updateConfig(config);
    const enabledCategories = config.categories
      .filter(cat => cat.enabled)
      .map(cat => cat.name);

    if (enabledCategories.length === 0) {
      alert('Please enable at least one category!');
      return;
    }

    startQuiz(enabledCategories, selectedLevel);
  };

  return (
    <div className="config-page">
      <h2>Quiz Configuration</h2>

      {/* Categories Section */}
      <section className="config-section">
        <h3>1. Select Categories</h3>
        <div className="categories-grid">
          {config.categories.map(category => (
            <label key={category.id} className="category-checkbox">
              <input
                type="checkbox"
                checked={category.enabled}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Questions Per Round */}
      <section className="config-section">
        <h3>2. Questions Per Round</h3>
        <input
          type="number"
          min="1"
          max="50"
          value={config.questionsPerRound}
          onChange={e => handleQuestionsPerRoundChange(parseInt(e.target.value))}
          className="config-input"
        />
      </section>

      {/* Question Distribution */}
      <section className="config-section">
        <h3>3. Question Distribution</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="distribution"
              value="even"
              checked={config.questionDistribution === 'even'}
              onChange={() => handleDistributionChange('even')}
            />
            <span>Even (equal questions from each category)</span>
          </label>
          <label>
            <input
              type="radio"
              name="distribution"
              value="weighted"
              checked={config.questionDistribution === 'weighted'}
              onChange={() => handleDistributionChange('weighted')}
            />
            <span>Weighted (based on scoring)</span>
          </label>
          <label>
            <input
              type="radio"
              name="distribution"
              value="random"
              checked={config.questionDistribution === 'random'}
              onChange={() => handleDistributionChange('random')}
            />
            <span>Random</span>
          </label>
        </div>
      </section>

      {/* Quiz Levels */}
      <section className="config-section">
        <h3>4. Select Quiz Level</h3>
        <div className="level-selector">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              className={`level-button ${selectedLevel === level ? 'selected' : ''}`}
              onClick={() => setSelectedLevel(level)}
            >
              Level {level}
            </button>
          ))}
        </div>
      </section>

      {/* AI Research Settings */}
      <section className="config-section">
        <h3>5. AI Research Settings (Future Feature)</h3>
        <label className="config-checkbox">
          <input
            type="checkbox"
            checked={config.aiResearchEnabled}
            onChange={e =>
              setConfig({ ...config, aiResearchEnabled: e.target.checked })
            }
          />
          <span>Enable AI-powered question generation</span>
        </label>
        <p className="feature-note">
          This feature will allow the app to research and generate new questions automatically.
        </p>
      </section>

      {/* Scoring Weights */}
      <section className="config-section">
        <h3>6. Question Selection Weights</h3>
        <div className="weight-controls">
          <div className="weight-item">
            <label>Never Used Questions Weight:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.scoringWeights.neverUsedWeight}
              onChange={e =>
                handleWeightChange('neverUsedWeight', parseFloat(e.target.value))
              }
            />
            <span>{config.scoringWeights.neverUsedWeight.toFixed(1)}</span>
          </div>
          <div className="weight-item">
            <label>Wrongly Answered Questions Weight:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.scoringWeights.wronglyAnsweredWeight}
              onChange={e =>
                handleWeightChange('wronglyAnsweredWeight', parseFloat(e.target.value))
              }
            />
            <span>{config.scoringWeights.wronglyAnsweredWeight.toFixed(1)}</span>
          </div>
          <div className="weight-item">
            <label>Least Used Questions Weight:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.scoringWeights.leastUsedWeight}
              onChange={e =>
                handleWeightChange('leastUsedWeight', parseFloat(e.target.value))
              }
            />
            <span>{config.scoringWeights.leastUsedWeight.toFixed(1)}</span>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="config-actions">
        <button onClick={handleSaveConfig} className="btn btn-secondary">
          Save Configuration
        </button>
        <button onClick={handleStartQuiz} className="btn btn-primary">
          Start Quiz
        </button>
      </div>
    </div>
  );
};
