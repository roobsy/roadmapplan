export interface Question {
  id: string;
  category: string;
  text: string;
  answers: string[]; // Array of 5 possible answers
  correctAnswerIndex: number; // Index of the correct answer (0-4)
  hint: string;
  level: number; // 1-5 or however many levels
  stats: QuestionStats;
}

export interface QuestionStats {
  timesUsed: number;
  timesCorrect: number;
  timesWrong: number;
  lastUsed?: Date;
  difficulty?: number; // Calculated based on correct/wrong ratio
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
}

export interface QuizConfig {
  categories: Category[];
  questionsPerRound: number;
  questionDistribution: 'even' | 'random' | 'weighted';
  levels: number[];
  aiResearchEnabled: boolean;
  aiResearchSettings: {
    sources: string[];
    frequency: 'manual' | 'daily' | 'weekly';
  };
  scoringWeights: {
    neverUsedWeight: number;
    wronglyAnsweredWeight: number;
    leastUsedWeight: number;
  };
  statsRoundsToShow: number; // How many recent rounds to show in stats
}

export interface QuizSession {
  id: string;
  level: number;
  categories: string[];
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timestamp: Date;
}

export interface QuizResult {
  sessionId: string;
  level: number;
  categories: string[];
  questions: Question[];
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt: Date;
  retakes?: QuizRetake[];
}

export interface QuizRetake {
  retakeId: string;
  originalSessionId: string;
  answers: UserAnswer[];
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt: Date;
}

export interface AppState {
  currentView: 'config' | 'quiz' | 'history';
  config: QuizConfig;
  currentSession: QuizSession | null;
  history: QuizResult[];
  questionBank: Question[];
}

export type QuestionSelectionStrategy = 'neverUsed' | 'wronglyAnswered' | 'leastUsed' | 'random';
