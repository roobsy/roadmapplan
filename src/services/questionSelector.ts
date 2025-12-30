import type { Question, QuizConfig } from '../types';

export class QuestionSelector {
  /**
   * Selects questions for a quiz round based on configuration and scoring weights
   */
  static selectQuestions(
    questionBank: Question[],
    config: QuizConfig,
    selectedCategories: string[],
    selectedLevel: number
  ): Question[] {
    // Filter questions by categories and level
    let availableQuestions = questionBank.filter(
      q => selectedCategories.includes(q.category) && q.level === selectedLevel
    );

    if (availableQuestions.length === 0) {
      throw new Error('No questions available for the selected criteria');
    }

    const questionsPerRound = config.questionsPerRound;

    // If we have fewer questions than needed, return all available
    if (availableQuestions.length <= questionsPerRound) {
      return [...availableQuestions];
    }

    // Calculate scores for each question based on weighting strategy
    const scoredQuestions = availableQuestions.map(question => ({
      question,
      score: this.calculateQuestionScore(question, config.scoringWeights)
    }));

    // Sort by score (higher score = higher priority)
    scoredQuestions.sort((a, b) => b.score - a.score);

    // Distribute questions across categories if even distribution is enabled
    if (config.questionDistribution === 'even') {
      return this.distributeEvenly(scoredQuestions, questionsPerRound, selectedCategories);
    }

    // For weighted or random, take top scored questions
    return scoredQuestions.slice(0, questionsPerRound).map(sq => sq.question);
  }

  /**
   * Calculates a score for a question based on usage stats and weights
   * Higher score = higher priority for selection
   */
  private static calculateQuestionScore(
    question: Question,
    weights: QuizConfig['scoringWeights']
  ): number {
    let score = 0;

    // Never used questions get highest priority
    if (question.stats.timesUsed === 0) {
      score += weights.neverUsedWeight * 100;
    } else {
      // Least used questions get priority based on inverse usage
      const usageScore = 1 / (question.stats.timesUsed + 1);
      score += weights.leastUsedWeight * usageScore * 100;
    }

    // Questions that were answered wrong more often get higher priority
    if (question.stats.timesWrong > 0) {
      const wrongRatio = question.stats.timesWrong / (question.stats.timesUsed || 1);
      score += weights.wronglyAnsweredWeight * wrongRatio * 100;
    }

    // Add some randomness to prevent always selecting the same questions
    score += Math.random() * 10;

    return score;
  }

  /**
   * Distributes questions evenly across categories
   */
  private static distributeEvenly(
    scoredQuestions: Array<{ question: Question; score: number }>,
    totalQuestions: number,
    categories: string[]
  ): Question[] {
    const questionsPerCategory = Math.floor(totalQuestions / categories.length);
    const remainder = totalQuestions % categories.length;

    const selectedQuestions: Question[] = [];
    const categoryQuestions = new Map<string, Array<{ question: Question; score: number }>>();

    // Group questions by category
    for (const sq of scoredQuestions) {
      if (!categoryQuestions.has(sq.question.category)) {
        categoryQuestions.set(sq.question.category, []);
      }
      categoryQuestions.get(sq.question.category)!.push(sq);
    }

    // Select questions from each category
    let categoriesWithQuestions = [...categories];
    for (const category of categories) {
      const questions = categoryQuestions.get(category) || [];
      const toSelect = questionsPerCategory + (remainder > 0 && categoriesWithQuestions.indexOf(category) < remainder ? 1 : 0);

      for (let i = 0; i < Math.min(toSelect, questions.length); i++) {
        selectedQuestions.push(questions[i].question);
      }
    }

    // If we still need more questions, fill from highest scored remaining
    if (selectedQuestions.length < totalQuestions) {
      const remaining = scoredQuestions
        .filter(sq => !selectedQuestions.includes(sq.question))
        .slice(0, totalQuestions - selectedQuestions.length);
      selectedQuestions.push(...remaining.map(sq => sq.question));
    }

    return selectedQuestions;
  }

  /**
   * Updates question statistics after an answer is submitted
   */
  static updateQuestionStats(question: Question, isCorrect: boolean): Question {
    const updatedQuestion = { ...question };
    updatedQuestion.stats = {
      ...question.stats,
      timesUsed: question.stats.timesUsed + 1,
      timesCorrect: isCorrect ? question.stats.timesCorrect + 1 : question.stats.timesCorrect,
      timesWrong: !isCorrect ? question.stats.timesWrong + 1 : question.stats.timesWrong,
      lastUsed: new Date(),
    };

    // Calculate difficulty (0-1, where 1 is most difficult)
    if (updatedQuestion.stats.timesUsed > 0) {
      updatedQuestion.stats.difficulty =
        updatedQuestion.stats.timesWrong / updatedQuestion.stats.timesUsed;
    }

    return updatedQuestion;
  }

  /**
   * Gets statistics about the question bank
   */
  static getQuestionBankStats(questionBank: Question[], _recentRounds: number = 10) {
    const total = questionBank.length;
    const neverUsed = questionBank.filter(q => q.stats.timesUsed === 0).length;
    const used = total - neverUsed;

    // Calculate recent stats (this would need to be enhanced with actual recent quiz data)
    let recentCorrect = 0;
    let recentWrong = 0;

    for (const question of questionBank) {
      // For now, we'll use all-time stats
      // In a full implementation, you'd track per-quiz stats
      recentCorrect += question.stats.timesCorrect;
      recentWrong += question.stats.timesWrong;
    }

    return {
      total,
      used,
      neverUsed,
      recentCorrect,
      recentWrong,
    };
  }
}
