'use client';

import React, { useState, memo } from 'react';

interface PeriodReportsProps {
  onGenerateReport: (type: 'week' | 'month') => void;
  generatingPeriodReport: boolean;
  periodReportType: string | null;
}

const PeriodReports = memo(function PeriodReports({
  onGenerateReport,
  generatingPeriodReport,
  periodReportType,
}: PeriodReportsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4 space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg text-center transition-colors border border-purple-200 dark:border-purple-700"
      >
        <div className="font-medium text-gray-900 dark:text-white flex items-center justify-center gap-2">
          📈 Generate Period Reports
          <span
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Weekly & monthly mood analysis
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Generate comprehensive reports analyzing your mood patterns and
            trends over time.
          </div>

          <button
            onClick={() => onGenerateReport('week')}
            disabled={generatingPeriodReport}
            className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left transition-colors disabled:opacity-50 border border-blue-200 dark:border-blue-700"
          >
            <div className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
              📅 This Week
              {generatingPeriodReport && periodReportType === 'week' && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 7 days of mood data
            </div>
          </button>

          <button
            onClick={() => onGenerateReport('month')}
            disabled={generatingPeriodReport}
            className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-left transition-colors disabled:opacity-50 border border-blue-200 dark:border-blue-700"
          >
            <div className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
              📆 This Month
              {generatingPeriodReport && periodReportType === 'month' && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 30 days of mood data
            </div>
          </button>

          {/* Info about what's included */}
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="text-xs text-yellow-800 dark:text-yellow-200">
              <div className="font-medium mb-1">📊 Report includes:</div>
              <div className="text-left space-y-1">
                • Average mood trends and patterns
                <br />
                • Most common emotions and triggers
                <br />
                • Improvement recommendations
                <br />
                • Personalized CBT techniques
                <br />• PDF download for your records
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PeriodReports;
