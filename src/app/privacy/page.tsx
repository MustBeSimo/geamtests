'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>

          {/* Important Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🔒</span>
              <div>
                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-3">
                  IMPORTANT PRIVACY NOTICE
                </h2>
                <div className="text-blue-700 dark:text-blue-300 space-y-3">
                  <p className="font-semibold">
                    This service does NOT provide doctor-patient confidentiality
                    or therapeutic privilege.
                  </p>
                  <p>
                    While we protect your data with industry-standard security
                    measures, conversations with our AI do not have the same
                    legal protections as therapy with licensed mental health
                    professionals.
                  </p>
                  <p className="font-semibold">
                    For truly confidential mental health support, please consult
                    with licensed professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Account Information:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email address (via Google authentication)</li>
                  <li>Basic profile information from Google</li>
                  <li>Account creation and last login dates</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Usage Data:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Chat messages and conversations with AI</li>
                  <li>Mood tracking entries and ratings</li>
                  <li>Feature usage patterns and app interactions</li>
                  <li>Device information and IP addresses</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide AI-powered educational wellness content</li>
                <li>Maintain your account and user preferences</li>
                <li>Improve our AI responses and app functionality</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Send important service updates and notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Data Storage and Security
              </h2>
              <div className="space-y-3">
                <p>
                  We implement industry-standard security measures including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encrypted data transmission (HTTPS/TLS)</li>
                  <li>Secure database storage with encryption at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access controls for our team</li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                    However, no system is 100% secure. We cannot guarantee
                    absolute security of your data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-3">
                <p>
                  We do NOT sell your personal data. We may share information in
                  these limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties
                    that help us operate the app (e.g., hosting, analytics)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law,
                    court order, or to protect safety
                  </li>
                  <li>
                    <strong>Emergency Situations:</strong> If we believe there's
                    imminent danger to you or others
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In case of merger,
                    acquisition, or sale of assets
                  </li>
                </ul>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Important Limitation:
                  </p>
                  <p className="text-red-700 dark:text-red-300">
                    Unlike therapy with licensed professionals, your
                    conversations with our AI are not protected by
                    doctor-patient confidentiality or therapeutic privilege
                    laws.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Third-Party Services
              </h2>
              <div className="space-y-3">
                <p>We use third-party services that may collect data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Google Authentication:</strong> For secure login
                    (Google Privacy Policy applies)
                  </li>
                  <li>
                    <strong>Stripe:</strong> For payment processing (Stripe
                    Privacy Policy applies)
                  </li>
                  <li>
                    <strong>Supabase:</strong> For data storage and
                    authentication (Supabase Privacy Policy applies)
                  </li>
                  <li>
                    <strong>Analytics Services:</strong> For app usage analysis
                    (anonymized data)
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Your Rights and Choices
              </h2>
              <div className="space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a common
                    format
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Stop using the service at any
                    time
                  </li>
                </ul>

                <p className="mt-4">
                  To exercise these rights, contact us at simone@w230.net
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <div className="space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Account Data:</strong> Retained while your account
                    is active
                  </li>
                  <li>
                    <strong>Chat Messages:</strong> Stored for service
                    improvement (can be deleted upon request)
                  </li>
                  <li>
                    <strong>Usage Analytics:</strong> Aggregated data may be
                    retained longer for product improvement
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> Some data may be
                    retained longer if required by law
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Age Restrictions
              </h2>
              <p className="font-semibold text-red-600 dark:text-red-400 mb-3">
                THIS SERVICE IS NOT AVAILABLE TO USERS UNDER 18 YEARS OF AGE.
              </p>
              <p>
                We do not knowingly collect personal information from minors. If
                we discover that we have collected information from someone
                under 18, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. International Users
              </h2>
              <p>
                Our servers are located in the United States. If you're
                accessing our service from outside the US, your data may be
                transferred to and processed in the United States, which may
                have different privacy laws than your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Changes to Privacy Policy
              </h2>
              <p>
                We may update this privacy policy periodically. We'll notify you
                of significant changes via email or app notification. Continued
                use after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Contact Us
              </h2>
              <div className="space-y-2">
                <p>For privacy-related questions or requests:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    <strong>Email:</strong> simone@w230.net
                  </li>
                  <li>
                    <strong>Subject Line:</strong> "Privacy Policy Inquiry"
                  </li>
                  <li>
                    <strong>Response Time:</strong> We aim to respond within 30
                    days
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              By using Mind Gleam, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
