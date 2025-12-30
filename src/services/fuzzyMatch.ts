import type { Question } from '../types';

export class FuzzyMatcher {
  /**
   * Calculates similarity between two questions
   * Returns a value between 0 and 1, where 1 is identical
   */
  static calculateSimilarity(q1: Question, q2: Question): number {
    // Calculate text similarity using Levenshtein distance
    const textSimilarity = this.stringSimilarity(
      this.normalizeText(q1.text),
      this.normalizeText(q2.text)
    );

    // If text similarity is very low, they're definitely different
    if (textSimilarity < 0.3) return 0;

    // Check if categories match (important indicator)
    const categoryMatch = q1.category.toLowerCase() === q2.category.toLowerCase();
    if (!categoryMatch) return textSimilarity * 0.5; // Reduce similarity if categories don't match

    // Check if correct answers match
    const correctAnswerSimilarity = this.stringSimilarity(
      this.normalizeText(q1.answers[q1.correctAnswerIndex]),
      this.normalizeText(q2.answers[q2.correctAnswerIndex])
    );

    // Check if all answers are similar (order may be different)
    const answersSimilarity = this.answersSimilarity(q1.answers, q2.answers);

    // Weighted average of similarities
    const overallSimilarity =
      textSimilarity * 0.5 +
      correctAnswerSimilarity * 0.3 +
      answersSimilarity * 0.2;

    return overallSimilarity;
  }

  /**
   * Checks if two questions are duplicates based on sensitivity threshold
   * @param q1 First question
   * @param q2 Second question
   * @param sensitivity Threshold (0-1), default 0.7. Higher = more strict
   */
  static isDuplicate(q1: Question, q2: Question, sensitivity: number = 0.7): boolean {
    const similarity = this.calculateSimilarity(q1, q2);
    return similarity >= sensitivity;
  }

  /**
   * Finds duplicate questions in a list
   */
  static findDuplicates(
    newQuestions: Question[],
    existingQuestions: Question[],
    sensitivity: number = 0.7
  ): Map<string, Question[]> {
    const duplicates = new Map<string, Question[]>();

    for (const newQ of newQuestions) {
      const matches: Question[] = [];

      for (const existingQ of existingQuestions) {
        if (this.isDuplicate(newQ, existingQ, sensitivity)) {
          matches.push(existingQ);
        }
      }

      if (matches.length > 0) {
        duplicates.set(newQ.id, matches);
      }
    }

    return duplicates;
  }

  /**
   * Normalizes text for comparison
   */
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Calculates similarity between two strings using Levenshtein distance
   * Returns a value between 0 and 1
   */
  private static stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculates Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculates similarity between two answer sets
   */
  private static answersSimilarity(answers1: string[], answers2: string[]): number {
    let totalSimilarity = 0;
    const normalized1 = answers1.map(a => this.normalizeText(a));
    const normalized2 = answers2.map(a => this.normalizeText(a));

    // For each answer in set 1, find the best match in set 2
    for (const ans1 of normalized1) {
      let bestMatch = 0;
      for (const ans2 of normalized2) {
        const similarity = this.stringSimilarity(ans1, ans2);
        bestMatch = Math.max(bestMatch, similarity);
      }
      totalSimilarity += bestMatch;
    }

    return totalSimilarity / answers1.length;
  }

  /**
   * Gets recommended sensitivity level
   */
  static getRecommendedSensitivity(): number {
    return 0.7; // 70% similarity threshold is a good balance
  }

  /**
   * Gets sensitivity description
   */
  static getSensitivityDescription(sensitivity: number): string {
    if (sensitivity >= 0.9) return 'Very Strict (only near-identical questions)';
    if (sensitivity >= 0.75) return 'Strict (similar questions with minor differences)';
    if (sensitivity >= 0.6) return 'Moderate (questions with similar meaning)';
    if (sensitivity >= 0.4) return 'Lenient (broadly similar questions)';
    return 'Very Lenient (loosely related questions)';
  }
}
