import React, { useState } from 'react';
import type { ImportExportLog } from '../types';
import './ImportExportLog.css';

interface ImportExportLogProps {
  logs: ImportExportLog[];
}

export const ImportExportLogComponent: React.FC<ImportExportLogProps> = ({ logs }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActionLabel = (log: ImportExportLog): string => {
    if (log.actionType === 'export') {
      if (log.exportType === 'template') return 'Export Template';
      if (log.exportType === 'filtered') return 'Export Filtered';
      return 'Export All';
    } else {
      if (log.importType === 'incremental') return 'Import Incremental';
      if (log.importType === 'full') return 'Import Full';
      return 'Import';
    }
  };

  const getActionClass = (log: ImportExportLog): string => {
    return log.actionType === 'export' ? 'action-export' : 'action-import';
  };

  const downloadBackup = (fileName: string) => {
    const backup = localStorage.getItem(fileName);
    if (backup) {
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (logs.length === 0) {
    return (
      <div className="import-export-log">
        <h4>Import/Export History</h4>
        <p className="no-logs">No import/export operations yet.</p>
      </div>
    );
  }

  return (
    <div className="import-export-log">
      <h4>Import/Export History</h4>
      <div className="log-list">
        {logs.map((log) => (
          <div key={log.id} className="log-item">
            <div className="log-header" onClick={() => toggleExpand(log.id)}>
              <div className="log-info">
                <span className={`action-badge ${getActionClass(log)}`}>
                  {getActionLabel(log)}
                </span>
                <span className="log-date">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className="log-filename">{log.fileName}</span>
              </div>
              <div className="log-stats-summary">
                <span className="stat-success">{log.stats.successRows} success</span>
                {log.stats.errorRows > 0 && (
                  <span className="stat-error">{log.stats.errorRows} errors</span>
                )}
                {log.stats.duplicateRows && log.stats.duplicateRows > 0 && (
                  <span className="stat-warning">{log.stats.duplicateRows} duplicates</span>
                )}
              </div>
              <button className="expand-btn">
                {expandedId === log.id ? '▼' : '▶'}
              </button>
            </div>

            {expandedId === log.id && (
              <div className="log-details">
                <div className="detail-section">
                  <h5>Statistics</h5>
                  <div className="detail-row">
                    <span>Total Rows:</span>
                    <span>{log.stats.totalRows}</span>
                  </div>
                  <div className="detail-row">
                    <span>Success:</span>
                    <span className="success">{log.stats.successRows}</span>
                  </div>
                  {log.stats.errorRows > 0 && (
                    <div className="detail-row">
                      <span>Errors:</span>
                      <span className="error">{log.stats.errorRows}</span>
                    </div>
                  )}
                  {log.stats.duplicateRows !== undefined && log.stats.duplicateRows > 0 && (
                    <div className="detail-row">
                      <span>Duplicates:</span>
                      <span className="warning">{log.stats.duplicateRows}</span>
                    </div>
                  )}
                </div>

                {log.filters && (
                  <div className="detail-section">
                    <h5>Filters Applied</h5>
                    <div className="detail-row">
                      <span>Status:</span>
                      <span>{log.filters.status}</span>
                    </div>
                    {log.filters.levels.length > 0 && (
                      <div className="detail-row">
                        <span>Levels:</span>
                        <span>{log.filters.levels.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {log.errors && log.errors.length > 0 && (
                  <div className="detail-section">
                    <h5>Errors (first 10)</h5>
                    <ul className="error-list">
                      {log.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {log.actionType === 'import' && log.importType === 'full' && (
                  <div className="detail-section">
                    <button
                      className="btn btn-secondary"
                      onClick={() => downloadBackup(log.fileName.replace('.csv', '-backup.json'))}
                    >
                      Download Backup
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
