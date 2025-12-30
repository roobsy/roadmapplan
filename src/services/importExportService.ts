import type { Question, ExportFilters, ImportResult, ImportExportLog } from '../types';
import { CSVService } from './csvService';
import { FuzzyMatcher } from './fuzzyMatch';
import { StorageService } from './storage';

export class ImportExportService {
  /**
   * Exports questions based on filters
   */
  static exportQuestions(
    questions: Question[],
    filters?: ExportFilters,
    includeStats: boolean = true
  ): { csv: string; filename: string; log: ImportExportLog } {
    let filteredQuestions = [...questions];

    // Apply filters if provided
    if (filters) {
      // Filter by status
      if (filters.status !== 'all') {
        filteredQuestions = this.filterByStatus(filteredQuestions, filters.status);
      }

      // Filter by levels
      if (filters.levels.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => filters.levels.includes(q.level));
      }
    }

    const csv = CSVService.questionsToCSV(filteredQuestions, includeStats);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filterDesc = filters ? this.getFilterDescription(filters) : 'all';
    const filename = `quiz-questions-${filterDesc}-${timestamp}.csv`;

    const log: ImportExportLog = {
      id: `export-${Date.now()}`,
      actionType: 'export',
      exportType: filters ? 'filtered' : 'all',
      timestamp: new Date(),
      fileName: filename,
      stats: {
        totalRows: filteredQuestions.length,
        successRows: filteredQuestions.length,
        errorRows: 0,
      },
      filters,
    };

    return { csv, filename, log };
  }

  /**
   * Exports template CSV
   */
  static exportTemplate(): { csv: string; filename: string; log: ImportExportLog } {
    const csv = CSVService.generateTemplate();
    const filename = 'quiz-questions-template.csv';

    const log: ImportExportLog = {
      id: `export-template-${Date.now()}`,
      actionType: 'export',
      exportType: 'template',
      timestamp: new Date(),
      fileName: filename,
      stats: {
        totalRows: 1,
        successRows: 1,
        errorRows: 0,
      },
    };

    return { csv, filename, log };
  }

  /**
   * Imports questions incrementally with deduplication
   */
  static async importIncremental(
    csvContent: string,
    existingQuestions: Question[],
    sensitivity: number
  ): Promise<ImportResult & { log: ImportExportLog }> {
    const { questions: parsedQuestions, errors } = CSVService.parseCSV(csvContent);

    if (parsedQuestions.length === 0) {
      const result: ImportResult = {
        success: false,
        stats: {
          totalRows: 0,
          successRows: 0,
          errorRows: errors.length,
          duplicateRows: 0,
        },
        errors,
        questions: [],
      };

      const log: ImportExportLog = {
        id: `import-${Date.now()}`,
        actionType: 'import',
        importType: 'incremental',
        timestamp: new Date(),
        fileName: 'uploaded-file.csv',
        stats: result.stats,
        errors,
      };

      return { ...result, log };
    }

    // Find duplicates
    const duplicates = FuzzyMatcher.findDuplicates(
      parsedQuestions,
      existingQuestions,
      sensitivity
    );

    // Filter out duplicates
    const uniqueQuestions = parsedQuestions.filter(q => !duplicates.has(q.id));

    const totalRows = parsedQuestions.length;
    const duplicateRows = duplicates.size;
    const errorRows = errors.length;
    const successRows = uniqueQuestions.length;

    const result: ImportResult = {
      success: successRows > 0,
      stats: {
        totalRows,
        successRows,
        errorRows,
        duplicateRows,
      },
      errors,
      questions: uniqueQuestions,
    };

    const log: ImportExportLog = {
      id: `import-${Date.now()}`,
      actionType: 'import',
      importType: 'incremental',
      timestamp: new Date(),
      fileName: 'uploaded-file.csv',
      stats: result.stats,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Store first 10 errors
    };

    return { ...result, log };
  }

  /**
   * Imports questions with full replacement (after backup)
   */
  static async importFull(csvContent: string): Promise<ImportResult & { log: ImportExportLog; backup: Question[] }> {
    // Get current questions for backup
    const backup = StorageService.getQuestionBank();

    const { questions: parsedQuestions, errors } = CSVService.parseCSV(csvContent);

    const totalRows = parsedQuestions.length + (errors.length > 0 ? 1 : 0);
    const errorRows = errors.length;
    const successRows = parsedQuestions.length;

    const result: ImportResult = {
      success: successRows > 0,
      stats: {
        totalRows,
        successRows,
        errorRows,
        duplicateRows: 0, // No deduplication in full import
      },
      errors,
      questions: parsedQuestions,
    };

    const log: ImportExportLog = {
      id: `import-${Date.now()}`,
      actionType: 'import',
      importType: 'full',
      timestamp: new Date(),
      fileName: 'uploaded-file.csv',
      stats: result.stats,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    };

    return { ...result, log, backup };
  }

  /**
   * Filters questions by status
   */
  private static filterByStatus(questions: Question[], status: string): Question[] {
    switch (status) {
      case 'neverUsed':
        return questions.filter(q => q.stats.timesUsed === 0);
      case 'used':
        return questions.filter(q => q.stats.timesUsed > 0);
      case 'wronglyAnswered':
        return questions.filter(q => q.stats.timesWrong > 0);
      case 'correctlyAnswered':
        return questions.filter(q => q.stats.timesCorrect > 0 && q.stats.timesWrong === 0);
      default:
        return questions;
    }
  }

  /**
   * Gets a description of filters for filename
   */
  private static getFilterDescription(filters: ExportFilters): string {
    const parts: string[] = [];

    if (filters.status !== 'all') {
      parts.push(filters.status);
    }

    if (filters.levels.length > 0 && filters.levels.length < 5) {
      parts.push(`level${filters.levels.join('-')}`);
    }

    return parts.length > 0 ? parts.join('-') : 'all';
  }

  /**
   * Downloads the CSV file
   */
  static downloadCSV(csv: string, filename: string): void {
    CSVService.downloadCSV(csv, filename);
  }

  /**
   * Reads a file as text
   */
  static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      // Explicitly specify UTF-8 encoding
      reader.readAsText(file, 'UTF-8');
    });
  }
}
