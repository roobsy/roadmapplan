import type { Question, QuizConfig, QuizResult } from '../types';

const STORAGE_KEYS = {
  QUESTION_BANK: 'quiz_question_bank',
  CONFIG: 'quiz_config',
  HISTORY: 'quiz_history',
  CURRENT_SESSION: 'quiz_current_session',
};

export class StorageService {
  // Question Bank Operations
  static saveQuestionBank(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTION_BANK, JSON.stringify(questions));
  }

  static getQuestionBank(): Question[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTION_BANK);
    if (!data) return [];
    return JSON.parse(data, this.dateReviver);
  }

  static updateQuestion(question: Question): void {
    const questions = this.getQuestionBank();
    const index = questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      questions[index] = question;
      this.saveQuestionBank(questions);
    }
  }

  static addQuestion(question: Question): void {
    const questions = this.getQuestionBank();
    questions.push(question);
    this.saveQuestionBank(questions);
  }

  static addQuestions(newQuestions: Question[]): void {
    const questions = this.getQuestionBank();
    questions.push(...newQuestions);
    this.saveQuestionBank(questions);
  }

  // Config Operations
  static saveConfig(config: QuizConfig): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }

  static getConfig(): QuizConfig | null {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!data) return null;
    return JSON.parse(data);
  }

  // History Operations
  static saveHistory(history: QuizResult[]): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }

  static getHistory(): QuizResult[] {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];
    return JSON.parse(data, this.dateReviver);
  }

  static addToHistory(result: QuizResult): void {
    const history = this.getHistory();
    history.unshift(result); // Add to beginning (most recent first)
    this.saveHistory(history);
  }

  static updateHistoryItem(result: QuizResult): void {
    const history = this.getHistory();
    const index = history.findIndex(h => h.sessionId === result.sessionId);
    if (index !== -1) {
      history[index] = result;
      this.saveHistory(history);
    }
  }

  // Current Session Operations
  static saveCurrentSession(session: any): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  }

  static getCurrentSession(): any {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!data) return null;
    return JSON.parse(data, this.dateReviver);
  }

  static clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }

  // Utility function to revive Date objects when parsing JSON
  private static dateReviver(key: string, value: any): any {
    const dateFields = ['startTime', 'endTime', 'timestamp', 'completedAt', 'lastUsed'];
    if (dateFields.includes(key) && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  }

  // Clear all data
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Export/Import functionality
  static exportData(): string {
    const data = {
      questionBank: this.getQuestionBank(),
      config: this.getConfig(),
      history: this.getHistory(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.questionBank) this.saveQuestionBank(data.questionBank);
      if (data.config) this.saveConfig(data.config);
      if (data.history) this.saveHistory(data.history);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}
