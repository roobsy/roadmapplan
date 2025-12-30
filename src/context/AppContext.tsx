import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, QuizConfig, QuizSession, QuizResult, Question, ImportExportLog } from '../types';
import { StorageService } from '../services/storage';
import { QuestionSelector } from '../services/questionSelector';
import { initialQuestions, defaultCategories } from '../data/initialQuestions';

interface AppContextType {
  state: AppState;
  setCurrentView: (view: 'config' | 'quiz' | 'history') => void;
  updateConfig: (config: QuizConfig) => void;
  startQuiz: (categories: string[], level: number) => void;
  answerQuestion: (answerIndex: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  submitQuiz: () => void;
  retakeQuiz: (sessionId: string) => void;
  getQuestionBankStats: () => {
    total: number;
    used: number;
    neverUsed: number;
    recentCorrect: number;
    recentWrong: number;
  };
  addImportExportLog: (log: ImportExportLog) => void;
  updateQuestionBank: (questions: Question[]) => void;
  addQuestions: (questions: Question[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDefaultConfig = (): QuizConfig => ({
  categories: defaultCategories.map(name => ({ id: name.toLowerCase(), name, enabled: true })),
  questionsPerRound: 15,
  questionDistribution: 'even',
  levels: [1, 2, 3, 4, 5],
  aiResearchEnabled: false,
  aiResearchSettings: {
    sources: ['Wikipedia', 'OpenAI'],
    frequency: 'manual',
  },
  scoringWeights: {
    neverUsedWeight: 0.5,
    wronglyAnsweredWeight: 0.3,
    leastUsedWeight: 0.2,
  },
  statsRoundsToShow: 10,
  importExportLogs: [],
  fuzzyMatchSensitivity: 0.7, // Recommended default
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Initialize from storage or use defaults
    const savedConfig = StorageService.getConfig();
    const savedHistory = StorageService.getHistory();
    let questionBank = StorageService.getQuestionBank();

    // If no questions in storage, use initial questions
    if (questionBank.length === 0) {
      questionBank = initialQuestions;
      StorageService.saveQuestionBank(questionBank);
    }

    return {
      currentView: 'config',
      config: savedConfig || getDefaultConfig(),
      currentSession: null,
      history: savedHistory,
      questionBank,
    };
  });

  // Save config whenever it changes
  useEffect(() => {
    StorageService.saveConfig(state.config);
  }, [state.config]);

  // Save history whenever it changes
  useEffect(() => {
    StorageService.saveHistory(state.history);
  }, [state.history]);

  // Save question bank whenever it changes
  useEffect(() => {
    StorageService.saveQuestionBank(state.questionBank);
  }, [state.questionBank]);

  const setCurrentView = (view: 'config' | 'quiz' | 'history') => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const updateConfig = (config: QuizConfig) => {
    setState(prev => ({ ...prev, config }));
  };

  const startQuiz = (categories: string[], level: number) => {
    try {
      // Select questions for the quiz
      const selectedQuestions = QuestionSelector.selectQuestions(
        state.questionBank,
        state.config,
        categories,
        level
      );

      // Create new quiz session
      const newSession: QuizSession = {
        id: `quiz-${Date.now()}`,
        level,
        categories,
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: new Date(),
        completed: false,
      };

      setState(prev => ({
        ...prev,
        currentSession: newSession,
        currentView: 'quiz',
      }));
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert('Could not start quiz. Please check your configuration.');
    }
  };

  const answerQuestion = (answerIndex: number) => {
    if (!state.currentSession) return;

    const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: answerIndex,
      isCorrect,
      timestamp: new Date(),
    };

    // Check if answer already exists for this question
    const existingAnswerIndex = state.currentSession.answers.findIndex(
      a => a.questionId === currentQuestion.id
    );

    let updatedAnswers;
    if (existingAnswerIndex !== -1) {
      // Replace existing answer
      updatedAnswers = [...state.currentSession.answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      // Add new answer
      updatedAnswers = [...state.currentSession.answers, newAnswer];
    }

    setState(prev => ({
      ...prev,
      currentSession: prev.currentSession
        ? { ...prev.currentSession, answers: updatedAnswers }
        : null,
    }));
  };

  const goToNextQuestion = () => {
    if (!state.currentSession) return;

    const nextIndex = state.currentSession.currentQuestionIndex + 1;
    if (nextIndex < state.currentSession.questions.length) {
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession
          ? { ...prev.currentSession, currentQuestionIndex: nextIndex }
          : null,
      }));
    }
  };

  const goToPreviousQuestion = () => {
    if (!state.currentSession) return;

    const prevIndex = state.currentSession.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession
          ? { ...prev.currentSession, currentQuestionIndex: prevIndex }
          : null,
      }));
    }
  };

  const submitQuiz = () => {
    if (!state.currentSession) return;

    // Update question statistics
    const updatedQuestionBank = [...state.questionBank];
    state.currentSession.questions.forEach(question => {
      const answer = state.currentSession!.answers.find(a => a.questionId === question.id);
      if (answer) {
        const questionIndex = updatedQuestionBank.findIndex(q => q.id === question.id);
        if (questionIndex !== -1) {
          updatedQuestionBank[questionIndex] = QuestionSelector.updateQuestionStats(
            updatedQuestionBank[questionIndex],
            answer.isCorrect
          );
        }
      }
    });

    // Calculate results
    const correctAnswers = state.currentSession.answers.filter(a => a.isCorrect).length;
    const wrongAnswers = state.currentSession.answers.length - correctAnswers;
    const score = (correctAnswers / state.currentSession.questions.length) * 100;

    const result: QuizResult = {
      sessionId: state.currentSession.id,
      level: state.currentSession.level,
      categories: state.currentSession.categories,
      questions: state.currentSession.questions,
      answers: state.currentSession.answers,
      score,
      totalQuestions: state.currentSession.questions.length,
      correctAnswers,
      wrongAnswers,
      completedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentSession: prev.currentSession
        ? { ...prev.currentSession, completed: true, endTime: new Date() }
        : null,
      history: [result, ...prev.history],
      questionBank: updatedQuestionBank,
    }));
  };

  const retakeQuiz = (sessionId: string) => {
    const originalResult = state.history.find(h => h.sessionId === sessionId);
    if (!originalResult) return;

    // Create new session with same questions
    const newSession: QuizSession = {
      id: `quiz-retake-${Date.now()}`,
      level: originalResult.level,
      categories: originalResult.categories,
      questions: originalResult.questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      completed: false,
    };

    setState(prev => ({
      ...prev,
      currentSession: newSession,
      currentView: 'quiz',
    }));
  };

  const getQuestionBankStats = () => {
    return QuestionSelector.getQuestionBankStats(state.questionBank, state.config.statsRoundsToShow);
  };

  const addImportExportLog = (log: ImportExportLog) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        importExportLogs: [log, ...prev.config.importExportLogs],
      },
    }));
  };

  const updateQuestionBank = (questions: Question[]) => {
    setState(prev => ({
      ...prev,
      questionBank: questions,
    }));
  };

  const addQuestions = (questions: Question[]) => {
    setState(prev => ({
      ...prev,
      questionBank: [...prev.questionBank, ...questions],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setCurrentView,
        updateConfig,
        startQuiz,
        answerQuestion,
        goToNextQuestion,
        goToPreviousQuestion,
        submitQuiz,
        retakeQuiz,
        getQuestionBankStats,
        addImportExportLog,
        updateQuestionBank,
        addQuestions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
