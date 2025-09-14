'use client';

import React, { useState, memo } from 'react';
import { MoodReport as MoodReportType } from '@/types/database';
import Link from 'next/link';

interface MoodReportProps {
  report: MoodReportType;
  generatingReport: boolean;
  onDownloadPDF?: (report: MoodReportType) => void;
  onResetGenerating?: () => void;
  isDemo?: boolean;
}

const MoodReport = memo(function MoodReport({
  report,
  generatingReport,
  onDownloadPDF,
  onResetGenerating,
  isDemo = false,
}: MoodReportProps) {
  const [showReportOptions, setShowReportOptions] = useState(false);

  if (generatingReport) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
            Generating your personalized mood insights...
          </div>
          {/* Debug button - remove in production */}
          {onResetGenerating && (
            <button
              onClick={onResetGenerating}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              title="Debug: Force reset generating state"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-emerald-500">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🧠</span> Your Mood Insight
        </h4>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {report.insight}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🛠️</span> CBT Technique to Try
        </h4>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {report.cbtTechnique}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>💫</span> Affirmation
        </h4>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic">
          "{report.affirmation}"
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-orange-500">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🎯</span> Next Step
        </h4>
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {report.actionStep}
        </p>
      </div>

      {/* Mental Health Disclaimer */}
      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-red-500 text-sm">⚠️</span>
          <div className="text-red-700 dark:text-red-300 text-xs">
            <p className="font-semibold">IMPORTANT DISCLAIMER</p>
            <p>
              This AI provides educational wellness content only - not therapy
              or medical advice. For crisis support, call 988 (US) or contact
              emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isDemo && (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowReportOptions(!showReportOptions)}
            className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-center transition-colors border border-blue-200 dark:border-blue-700"
          >
            <div className="font-medium text-gray-900 dark:text-white flex items-center justify-center gap-2">
              📊 View Report Options
              <span
                className={`transform transition-transform ${showReportOptions ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </div>
          </button>

          {showReportOptions && (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* Download PDF Button */}
              {onDownloadPDF && (
                <button
                  onClick={() => onDownloadPDF(report)}
                  className="w-full p-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg text-left transition-colors border border-emerald-200 dark:border-emerald-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    📄 Download as PDF
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Save your personalized mood report
                  </div>
                </button>
              )}

              {/* Save to Journal */}
              <button className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg text-left transition-colors border border-purple-200 dark:border-purple-700">
                <div className="font-medium text-gray-900 dark:text-white">
                  📖 Save to Journal
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Add to your personal wellness journal
                </div>
              </button>

              {/* Share */}
              <button className="w-full p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg text-left transition-colors border border-yellow-200 dark:border-yellow-700">
                <div className="font-medium text-gray-900 dark:text-white">
                  🔗 Share Insight
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Share your affirmation with a friend
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Demo CTA */}
      {isDemo && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <div className="text-lg mb-2">
              ✨ Want more personalized insights?
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              Sign in to get unlimited mood check-ins, advanced reports, and
              track your progress over time.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Sign In for Full Access
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

export default MoodReport;
