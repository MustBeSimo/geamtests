'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { user, signOut } = useAuth();

  const handleDeleteData = async () => {
    if (!user || confirmText !== 'DELETE') return;

    setIsDeleting(true);
    try {
      // Call API to delete all user data
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Sign out user after successful deletion
      await signOut();
      
      // Show success message
      alert('Your account and all data have been successfully deleted.');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('There was an error deleting your account. Please contact support.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setConfirmText('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
                     {/* Header */}
           <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Privacy & Settings</h2>
                <p className="text-white/80">Manage your data and privacy preferences</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Privacy Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Privacy at Mind Gleam
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">🔒</span>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        We protect your privacy
                      </h4>
                      <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                        <li>• End-to-end TLS encryption for all communications</li>
                        <li>• Data at rest encrypted by Supabase</li>
                        <li>• We never sell your mood data or personal information</li>
                        <li>• Your conversations are private and confidential</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">📊</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        What data we collect
                      </h4>
                      <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                        <li>• Email address and profile information</li>
                        <li>• Chat conversations with AI companions</li>
                        <li>• Mood check-ins and wellness tracking</li>
                        <li>• Usage analytics to improve our service</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-500 text-xl">⚖️</span>
                    <div>
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Your rights
                      </h4>
                      <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                        <li>• Access your data at any time</li>
                        <li>• Request corrections to your information</li>
                        <li>• Export your data in a readable format</li>
                        <li>• Delete your account and all data permanently</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Account Management
              </h3>

              <div className="space-y-4">
                {/* Export Data */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Export Your Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download a copy of your conversations and mood data
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Data export feature coming soon!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Export
                  </button>
                </div>

                {/* Contact Support */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Contact Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Questions about your privacy or data handling?
                    </p>
                  </div>
                  <a
                    href="mailto:privacy@mindgleam.app"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Email Us
                  </a>
                </div>

                {/* Delete Account */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Delete My Account & Data
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Delete My Data
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                              Type "DELETE" to confirm:
                            </label>
                            <input
                              type="text"
                              value={confirmText}
                              onChange={(e) => setConfirmText(e.target.value)}
                              className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Type DELETE"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleDeleteData}
                              disabled={confirmText !== 'DELETE' || isDeleting}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                confirmText === 'DELETE' && !isDeleting
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setConfirmText('');
                              }}
                              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <a
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms of Service
                </a>
                <a
                  href="mailto:legal@mindgleam.app"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Legal Questions
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 