import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { ExportFilters, QuestionStatus, ImportResult } from '../types';
import { ImportExportService } from '../services/importExportService';
import { FuzzyMatcher } from '../services/fuzzyMatch';
import './ImportExport.css';

export const ImportExport: React.FC = () => {
  const { state, addImportExportLog, updateQuestionBank, addQuestions, updateConfig } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExportFilters, setShowExportFilters] = useState(false);
  const [exportFilters, setExportFilters] = useState<ExportFilters>({
    status: 'all',
    levels: [],
  });

  // Import state
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportResult, setShowImportResult] = useState(false);
  const [importing, setImporting] = useState(false);

  // Export handlers
  const handleExportAll = () => {
    const { csv, filename, log } = ImportExportService.exportQuestions(
      state.questionBank,
      undefined,
      true
    );
    ImportExportService.downloadCSV(csv, filename);
    addImportExportLog(log);
    setShowExportMenu(false);
  };

  const handleExportFiltered = () => {
    setShowExportFilters(true);
    setShowExportMenu(false);
  };

  const executeFilteredExport = () => {
    const { csv, filename, log } = ImportExportService.exportQuestions(
      state.questionBank,
      exportFilters,
      true
    );
    ImportExportService.downloadCSV(csv, filename);
    addImportExportLog(log);
    setShowExportFilters(false);
  };

  const handleExportTemplate = () => {
    const { csv, filename, log } = ImportExportService.exportTemplate();
    ImportExportService.downloadCSV(csv, filename);
    addImportExportLog(log);
    setShowExportMenu(false);
  };

  // Import handlers
  const handleImportIncremental = () => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.importType = 'incremental';
      fileInputRef.current.click();
    }
    setShowImportMenu(false);
  };

  const handleImportFull = () => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.importType = 'full';
      fileInputRef.current.click();
    }
    setShowImportMenu(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const importType = e.target.dataset.importType as 'incremental' | 'full';
    setImporting(true);
    setShowImportResult(false);

    try {
      const content = await ImportExportService.readFileAsText(file);

      if (importType === 'incremental') {
        const result = await ImportExportService.importIncremental(
          content,
          state.questionBank,
          state.config.fuzzyMatchSensitivity
        );

        if (result.success && result.questions.length > 0) {
          addQuestions(result.questions);
        }

        addImportExportLog(result.log);
        setImportResult(result);
        setShowImportResult(true);
      } else {
        // Full import
        const result = await ImportExportService.importFull(content);

        if (result.success && result.questions.length > 0) {
          // Create backup log
          const backupLog = {
            id: `backup-${Date.now()}`,
            actionType: 'export' as const,
            exportType: 'all' as const,
            timestamp: new Date(),
            fileName: `backup-before-full-import-${Date.now()}.json`,
            stats: {
              totalRows: result.backup.length,
              successRows: result.backup.length,
              errorRows: 0,
            },
          };
          addImportExportLog(backupLog);

          // Save backup to localStorage
          localStorage.setItem(backupLog.fileName, JSON.stringify(result.backup));

          // Replace all questions
          updateQuestionBank(result.questions);
        }

        addImportExportLog(result.log);
        setImportResult(result);
        setShowImportResult(true);
      }
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLevelToggle = (level: number) => {
    setExportFilters(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level],
    }));
  };

  const handleSensitivityChange = (value: number) => {
    updateConfig({
      ...state.config,
      fuzzyMatchSensitivity: value,
    });
  };

  return (
    <div className="import-export-section">
      <h3>Data Management</h3>

      <div className="import-export-controls">
        {/* Export Button with Menu */}
        <div className="button-with-menu">
          <button
            className="btn btn-secondary"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            Export Questions ▼
          </button>
          {showExportMenu && (
            <div className="dropdown-menu">
              <button onClick={handleExportAll}>Export All Questions (CSV)</button>
              <button onClick={handleExportFiltered}>Export with Filters...</button>
              <button onClick={handleExportTemplate}>Export Template CSV</button>
            </div>
          )}
        </div>

        {/* Import Button with Menu */}
        <div className="button-with-menu">
          <button
            className="btn btn-primary"
            onClick={() => setShowImportMenu(!showImportMenu)}
          >
            Import Questions ▼
          </button>
          {showImportMenu && (
            <div className="dropdown-menu">
              <button onClick={handleImportIncremental}>Import Incremental (with deduplication)</button>
              <button onClick={handleImportFull}>Import Full (replace all)</button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Fuzzy Match Sensitivity Control */}
      <div className="sensitivity-control">
        <label>
          Deduplication Sensitivity: <strong>{state.config.fuzzyMatchSensitivity.toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={state.config.fuzzyMatchSensitivity}
          onChange={(e) => handleSensitivityChange(parseFloat(e.target.value))}
        />
        <p className="sensitivity-description">
          {FuzzyMatcher.getSensitivityDescription(state.config.fuzzyMatchSensitivity)}
        </p>
        <p className="sensitivity-note">
          Recommended: 0.70 - This will detect questions that are phrased differently but have the same meaning.
        </p>
      </div>

      {/* Export Filters Modal */}
      {showExportFilters && (
        <div className="modal-overlay" onClick={() => setShowExportFilters(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Export Filters</h3>

            <div className="filter-section">
              <label>Question Status:</label>
              <select
                value={exportFilters.status}
                onChange={(e) =>
                  setExportFilters({ ...exportFilters, status: e.target.value as QuestionStatus })
                }
              >
                <option value="all">All Questions</option>
                <option value="neverUsed">Never Used/Asked</option>
                <option value="used">Already Used/Asked</option>
                <option value="wronglyAnswered">Wrongly Answered</option>
                <option value="correctlyAnswered">Correctly Answered</option>
              </select>
            </div>

            <div className="filter-section">
              <label>Question Levels:</label>
              <div className="level-checkboxes">
                {[1, 2, 3, 4, 5].map((level) => (
                  <label key={level}>
                    <input
                      type="checkbox"
                      checked={exportFilters.levels.includes(level)}
                      onChange={() => handleLevelToggle(level)}
                    />
                    Level {level}
                  </label>
                ))}
              </div>
              <p className="filter-note">Leave all unchecked to export all levels</p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowExportFilters(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={executeFilteredExport}>
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Result Modal */}
      {showImportResult && importResult && (
        <div className="modal-overlay" onClick={() => setShowImportResult(false)}>
          <div className="modal-content import-result" onClick={(e) => e.stopPropagation()}>
            <h3>Import {importResult.success ? 'Completed' : 'Failed'}</h3>

            <div className="import-stats">
              <div className="stat-row">
                <span>Total Rows:</span>
                <span>{importResult.stats.totalRows}</span>
              </div>
              <div className="stat-row success">
                <span>Successfully Imported:</span>
                <span>{importResult.stats.successRows}</span>
              </div>
              {importResult.stats.duplicateRows > 0 && (
                <div className="stat-row warning">
                  <span>Duplicates Skipped:</span>
                  <span>{importResult.stats.duplicateRows}</span>
                </div>
              )}
              {importResult.stats.errorRows > 0 && (
                <div className="stat-row error">
                  <span>Errors:</span>
                  <span>{importResult.stats.errorRows}</span>
                </div>
              )}
            </div>

            {importResult.errors.length > 0 && (
              <div className="import-errors">
                <h4>Errors:</h4>
                <ul>
                  {importResult.errors.slice(0, 10).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                  {importResult.errors.length > 10 && (
                    <li>... and {importResult.errors.length - 10} more errors</li>
                  )}
                </ul>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowImportResult(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Progress */}
      {importing && (
        <div className="import-progress">
          <p>Importing questions...</p>
        </div>
      )}
    </div>
  );
};
