import type { Question } from '../types';
import { FuzzyMatcher } from './fuzzyMatch';

export class AsyncDeduplicator {
  /**
   * Find duplicates efficiently using async processing
   * Uses hash-based exact matching first, then fuzzy matching only for similar questions
   */
  static async findDuplicatesAsync(
    newQuestions: Question[],
    existingQuestions: Question[],
    sensitivity: number,
    onProgress?: (processed: number, total: number) => void
  ): Promise<Map<string, Question[]>> {
    const duplicates = new Map<string, Question[]>();
    const chunkSize = 50; // Process 50 questions at a time

    console.log(`Starting async deduplication: ${newQuestions.length} new vs ${existingQuestions.length} existing`);

    // Step 1: Quick exact text match using hash map (O(n))
    const exactMatches = this.findExactDuplicates(newQuestions, existingQuestions);
    for (const [id, matches] of exactMatches) {
      duplicates.set(id, matches);
    }

    console.log(`Found ${exactMatches.size} exact matches`);

    // Step 2: Fuzzy match remaining questions in chunks
    const remaining = newQuestions.filter(q => !duplicates.has(q.id));
    console.log(`${remaining.length} questions need fuzzy matching`);

    for (let i = 0; i < remaining.length; i += chunkSize) {
      const chunk = remaining.slice(i, Math.min(i + chunkSize, remaining.length));

      // Process this chunk
      for (const newQ of chunk) {
        // Only fuzzy match against questions in same category (optimization)
        const candidatesForFuzzy = existingQuestions.filter(
          eq => eq.category === newQ.category && eq.level === newQ.level
        );

        const matches: Question[] = [];
        for (const existingQ of candidatesForFuzzy) {
          if (FuzzyMatcher.isDuplicate(newQ, existingQ, sensitivity)) {
            matches.push(existingQ);
          }
        }

        if (matches.length > 0) {
          duplicates.set(newQ.id, matches);
        }
      }

      // Report progress
      if (onProgress) {
        onProgress(Math.min(i + chunkSize, remaining.length), remaining.length);
      }

      // Yield to browser every chunk
      if (i + chunkSize < remaining.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    console.log(`Total duplicates found: ${duplicates.size}`);
    return duplicates;
  }

  /**
   * Find exact text duplicates using hash map (very fast - O(n))
   */
  private static findExactDuplicates(
    newQuestions: Question[],
    existingQuestions: Question[]
  ): Map<string, Question[]> {
    const duplicates = new Map<string, Question[]>();

    // Build hash map of existing questions by normalized text
    const existingByText = new Map<string, Question[]>();
    for (const eq of existingQuestions) {
      const normalized = this.normalizeForHash(eq.text);
      if (!existingByText.has(normalized)) {
        existingByText.set(normalized, []);
      }
      existingByText.get(normalized)!.push(eq);
    }

    // Check new questions against hash map
    for (const nq of newQuestions) {
      const normalized = this.normalizeForHash(nq.text);
      const matches = existingByText.get(normalized);
      if (matches && matches.length > 0) {
        duplicates.set(nq.id, matches);
      }
    }

    return duplicates;
  }

  /**
   * Find duplicates within a single batch efficiently
   */
  static async findInternalDuplicatesAsync(
    questions: Question[],
    sensitivity: number,
    onProgress?: (processed: number, total: number) => void
  ): Promise<Map<string, Question[]>> {
    const duplicates = new Map<string, Question[]>();
    const chunkSize = 100;

    console.log(`Finding internal duplicates in ${questions.length} questions...`);

    // Step 1: Exact matches using hash map
    const seen = new Map<string, Question>();
    const exactDups = new Map<string, Question[]>();

    for (const q of questions) {
      const normalized = this.normalizeForHash(q.text);
      const existing = seen.get(normalized);

      if (existing) {
        // Found exact duplicate
        if (!exactDups.has(q.id)) {
          exactDups.set(q.id, []);
        }
        exactDups.get(q.id)!.push(existing);
      } else {
        seen.set(normalized, q);
      }
    }

    console.log(`Found ${exactDups.size} exact internal duplicates`);
    for (const [id, matches] of exactDups) {
      duplicates.set(id, matches);
    }

    // Step 2: Fuzzy match remaining questions in chunks
    const unique = questions.filter(q => !duplicates.has(q.id));
    console.log(`${unique.length} questions need fuzzy internal matching`);

    for (let i = 0; i < unique.length; i += chunkSize) {
      const endIdx = Math.min(i + chunkSize, unique.length);

      // Check each question in this chunk against previous questions only
      for (let j = i; j < endIdx; j++) {
        const currentQ = unique[j];

        // Only check against earlier questions (not already marked as duplicates)
        for (let k = 0; k < j; k++) {
          const prevQ = unique[k];

          // Skip if different category/level (optimization)
          if (currentQ.category !== prevQ.category || currentQ.level !== prevQ.level) {
            continue;
          }

          // Skip if previous question is already a duplicate
          if (duplicates.has(prevQ.id)) {
            continue;
          }

          if (FuzzyMatcher.isDuplicate(currentQ, prevQ, sensitivity)) {
            if (!duplicates.has(currentQ.id)) {
              duplicates.set(currentQ.id, []);
            }
            duplicates.get(currentQ.id)!.push(prevQ);
            break; // Found duplicate, stop checking
          }
        }
      }

      // Report progress
      if (onProgress) {
        onProgress(endIdx, unique.length);
      }

      // Yield to browser
      if (endIdx < unique.length) {
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms pause
      }
    }

    console.log(`Total internal duplicates: ${duplicates.size}`);
    return duplicates;
  }

  /**
   * Normalize text for hash-based comparison
   */
  private static normalizeForHash(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }
}
