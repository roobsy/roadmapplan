import type { Question } from '../types';

export class CSVService {
  /**
   * Converts questions to CSV format
   */
  static questionsToCSV(questions: Question[], includeStats: boolean = true): string {
    const headers = [
      'id',
      'category',
      'level',
      'text',
      'answer1',
      'answer2',
      'answer3',
      'answer4',
      'answer5',
      'correctAnswerIndex',
      'hint',
    ];

    if (includeStats) {
      headers.push('timesUsed', 'timesCorrect', 'timesWrong', 'difficulty');
    }

    const rows = [headers.join(',')];

    for (const question of questions) {
      const row = [
        this.escapeCSV(question.id),
        this.escapeCSV(question.category),
        question.level.toString(),
        this.escapeCSV(question.text),
        this.escapeCSV(question.answers[0] || ''),
        this.escapeCSV(question.answers[1] || ''),
        this.escapeCSV(question.answers[2] || ''),
        this.escapeCSV(question.answers[3] || ''),
        this.escapeCSV(question.answers[4] || ''),
        question.correctAnswerIndex.toString(),
        this.escapeCSV(question.hint),
      ];

      if (includeStats) {
        row.push(
          question.stats.timesUsed.toString(),
          question.stats.timesCorrect.toString(),
          question.stats.timesWrong.toString(),
          (question.stats.difficulty || 0).toString()
        );
      }

      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  /**
   * Generates a template CSV for importing questions
   */
  static generateTemplate(): string {
    const headers = [
      'id',
      'category',
      'level',
      'text',
      'answer1',
      'answer2',
      'answer3',
      'answer4',
      'answer5',
      'correctAnswerIndex',
      'hint',
    ];

    const exampleRow = [
      'example-001',
      'Science',
      '1',
      'What is the chemical symbol for water?',
      'H2O',
      'O2',
      'CO2',
      'H2O2',
      'HO',
      '0',
      'It contains 2 hydrogen atoms and 1 oxygen atom.',
    ];

    return headers.join(',') + '\n' + exampleRow.join(',');
  }

  /**
   * Parses CSV content into questions
   */
  static parseCSV(csvContent: string): { questions: Question[]; errors: string[] } {
    const questions: Question[] = [];
    const errors: string[] = [];

    // Handle different line endings (Windows \r\n, Unix \n, old Mac \r)
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      errors.push('CSV file is empty or missing data');
      return { questions, errors };
    }

    const headers = this.parseCSVLine(lines[0]);
    const requiredHeaders = [
      'id',
      'category',
      'level',
      'text',
      'answer1',
      'answer2',
      'answer3',
      'answer4',
      'answer5',
      'correctAnswerIndex',
      'hint',
    ];

    // Debug logging
    console.log('CSV Parser Debug:');
    console.log('- Total lines:', lines.length);
    console.log('- First line raw:', lines[0]);
    console.log('- Detected headers:', headers);
    console.log('- Header count:', headers.length);
    console.log('- Required headers:', requiredHeaders);

    // Validate headers
    const missingHeaders: string[] = [];
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        missingHeaders.push(required);
      }
    }

    if (missingHeaders.length > 0) {
      errors.push(
        `Missing required columns: ${missingHeaders.join(', ')}. ` +
        `Detected headers: [${headers.join(', ')}]`
      );
      return { questions, errors };
    }

    if (errors.length > 0) {
      return { questions, errors };
    }

    const hasStats = headers.includes('timesUsed');

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        if (values.length === 0 || values.every(v => !v.trim())) continue;

        const getVal = (key: string) => {
          const index = headers.indexOf(key);
          return index >= 0 ? values[index] : '';
        };

        const id = getVal('id');
        const category = getVal('category');
        const level = parseInt(getVal('level'));
        const text = getVal('text');
        const answers = [
          getVal('answer1'),
          getVal('answer2'),
          getVal('answer3'),
          getVal('answer4'),
          getVal('answer5'),
        ];
        const correctAnswerIndex = parseInt(getVal('correctAnswerIndex'));
        const hint = getVal('hint');

        // Validation
        if (!id || !category || !text) {
          errors.push(`Row ${i + 1}: Missing required fields (id, category, or text)`);
          continue;
        }

        if (isNaN(level) || level < 1 || level > 5) {
          errors.push(`Row ${i + 1}: Invalid level (must be 1-5)`);
          continue;
        }

        if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 4) {
          errors.push(`Row ${i + 1}: Invalid correctAnswerIndex (must be 0-4)`);
          continue;
        }

        if (answers.some(a => !a.trim())) {
          errors.push(`Row ${i + 1}: All 5 answers must be provided`);
          continue;
        }

        const question: Question = {
          id,
          category,
          level,
          text,
          answers,
          correctAnswerIndex,
          hint: hint || '',
          stats: {
            timesUsed: hasStats ? parseInt(getVal('timesUsed')) || 0 : 0,
            timesCorrect: hasStats ? parseInt(getVal('timesCorrect')) || 0 : 0,
            timesWrong: hasStats ? parseInt(getVal('timesWrong')) || 0 : 0,
            difficulty: hasStats ? parseFloat(getVal('difficulty')) || 0 : 0,
          },
        };

        questions.push(question);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return { questions, errors };
  }

  /**
   * Parses CSV content asynchronously in chunks to prevent browser freezing
   * @param csvContent The CSV content to parse
   * @param chunkSize Number of rows to process per chunk (default: 100)
   * @param onProgress Optional callback for progress updates
   */
  static async parseCSVAsync(
    csvContent: string,
    chunkSize: number = 100,
    onProgress?: (processed: number, total: number) => void
  ): Promise<{ questions: Question[]; errors: string[] }> {
    const questions: Question[] = [];
    const errors: string[] = [];

    // Handle different line endings (Windows \r\n, Unix \n, old Mac \r)
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) {
      errors.push('CSV file is empty or missing data');
      return { questions, errors };
    }

    const headers = this.parseCSVLine(lines[0]);
    const requiredHeaders = [
      'id',
      'category',
      'level',
      'text',
      'answer1',
      'answer2',
      'answer3',
      'answer4',
      'answer5',
      'correctAnswerIndex',
      'hint',
    ];

    // Debug logging
    console.log('CSV Parser Debug (Async):');
    console.log('- Total lines:', lines.length);
    console.log('- Processing in chunks of:', chunkSize);

    // Validate headers
    const missingHeaders: string[] = [];
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        missingHeaders.push(required);
      }
    }

    if (missingHeaders.length > 0) {
      errors.push(
        `Missing required columns: ${missingHeaders.join(', ')}. ` +
        `Detected headers: [${headers.join(', ')}]`
      );
      return { questions, errors };
    }

    const hasStats = headers.includes('timesUsed');
    const totalRows = lines.length - 1;

    // Report initial progress to initialize UI
    if (onProgress) {
      onProgress(0, totalRows);
    }

    // Process rows in chunks
    for (let startIdx = 1; startIdx < lines.length; startIdx += chunkSize) {
      const endIdx = Math.min(startIdx + chunkSize, lines.length);

      // Process this chunk
      for (let i = startIdx; i < endIdx; i++) {
        try {
          const values = this.parseCSVLine(lines[i]);
          if (values.length === 0 || values.every(v => !v.trim())) continue;

          const getVal = (key: string) => {
            const index = headers.indexOf(key);
            return index >= 0 ? values[index] : '';
          };

          const id = getVal('id');
          const category = getVal('category');
          const level = parseInt(getVal('level'));
          const text = getVal('text');
          const answers = [
            getVal('answer1'),
            getVal('answer2'),
            getVal('answer3'),
            getVal('answer4'),
            getVal('answer5'),
          ];
          const correctAnswerIndex = parseInt(getVal('correctAnswerIndex'));
          const hint = getVal('hint');

          // Validation
          if (!id || !category || !text) {
            errors.push(`Row ${i + 1}: Missing required fields (id, category, or text)`);
            continue;
          }

          if (isNaN(level) || level < 1 || level > 5) {
            errors.push(`Row ${i + 1}: Invalid level (must be 1-5)`);
            continue;
          }

          if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex > 4) {
            errors.push(`Row ${i + 1}: Invalid correctAnswerIndex (must be 0-4)`);
            continue;
          }

          if (answers.some(a => !a.trim())) {
            errors.push(`Row ${i + 1}: All 5 answers must be provided`);
            continue;
          }

          const question: Question = {
            id,
            category,
            level,
            text,
            answers,
            correctAnswerIndex,
            hint: hint || '',
            stats: {
              timesUsed: hasStats ? parseInt(getVal('timesUsed')) || 0 : 0,
              timesCorrect: hasStats ? parseInt(getVal('timesCorrect')) || 0 : 0,
              timesWrong: hasStats ? parseInt(getVal('timesWrong')) || 0 : 0,
              difficulty: hasStats ? parseFloat(getVal('difficulty')) || 0 : 0,
            },
          };

          questions.push(question);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
        }
      }

      // Report progress
      const processed = Math.min(endIdx - 1, totalRows);
      if (onProgress) {
        console.log(`Progress: ${processed} / ${totalRows} rows (${((processed / totalRows) * 100).toFixed(1)}%)`);
        onProgress(processed, totalRows);
      }

      // Yield control back to browser to keep UI responsive
      if (endIdx < lines.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    console.log('CSV parsing complete:', questions.length, 'questions parsed');
    return { questions, errors };
  }

  /**
   * Parses a single CSV line, handling quoted fields
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Escapes a value for CSV format
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Downloads CSV content as a file
   */
  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
