'use client';

import React from 'react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>

          {/* Critical Medical Disclaimer */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">
                  CRITICAL MEDICAL DISCLAIMER
                </h2>
                <div className="text-red-700 dark:text-red-300 space-y-3">
                  <p className="font-semibold">
                    MIND GLEAM IS NOT A MEDICAL DEVICE, THERAPY SERVICE, OR
                    MENTAL HEALTH TREATMENT
                  </p>
                  <p>
                    This application provides educational wellness content only
                    and is NOT a substitute for professional medical care,
                    therapy, counseling, or mental health treatment.
                  </p>
                  <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded border border-red-300 dark:border-red-700">
                    <p className="font-semibold mb-2">EMERGENCY CONTACTS:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• US: 988 (Suicide & Crisis Lifeline) or 911</li>
                      <li>• Australia: 13 11 14 (Lifeline) or 000</li>
                      <li>• UK: 116 123 (Samaritans) or 999</li>
                      <li>• Canada: 1-833-456-4566 or 911</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Mind Gleam, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of
                Service. If you do not agree to these terms, you must not use
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Age Restriction
              </h2>
              <p className="font-semibold text-red-600 dark:text-red-400">
                YOU MUST BE 18 YEARS OR OLDER TO USE THIS SERVICE.
              </p>
              <p>
                This service is not intended for minors. By using Mind Gleam,
                you represent and warrant that you are at least 18 years of age.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Not Medical Advice
              </h2>
              <div className="space-y-3">
                <p className="font-semibold">Mind Gleam:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Does NOT provide medical, psychiatric, psychological, or
                    therapeutic advice
                  </li>
                  <li>
                    Is NOT a substitute for professional mental health care
                  </li>
                  <li>
                    Cannot diagnose, treat, cure, or prevent any medical or
                    mental health condition
                  </li>
                  <li>
                    Should NOT be used for medical emergencies or crisis
                    situations
                  </li>
                  <li>Cannot replace licensed mental health professionals</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Prohibited Uses
              </h2>
              <p className="font-semibold mb-3">
                DO NOT use Mind Gleam if you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are under 18 years of age</li>
                <li>Are experiencing a mental health crisis or emergency</li>
                <li>Have suicidal thoughts or self-harm ideation</li>
                <li>
                  Have severe mental health conditions requiring professional
                  treatment
                </li>
                <li>Are seeking medical or therapeutic advice</li>
                <li>
                  Are substituting this app for prescribed medications or
                  treatments
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. AI Limitations
              </h2>
              <div className="space-y-3">
                <p>Our AI system:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    May provide inaccurate, incomplete, or inappropriate
                    responses
                  </li>
                  <li>Cannot understand context like a human professional</li>
                  <li>Is not trained to handle crisis situations</li>
                  <li>
                    May misinterpret your input or provide unsuitable advice
                  </li>
                  <li>
                    Should never be relied upon for urgent mental health needs
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. User Responsibilities
              </h2>
              <div className="space-y-3">
                <p>By using this service, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use this app for educational purposes only</li>
                  <li>Continue consulting with your healthcare providers</li>
                  <li>Not rely on this app for medical decisions</li>
                  <li>Seek professional help for mental health concerns</li>
                  <li>Contact emergency services in crisis situations</li>
                  <li>Not use this app to replace prescribed treatments</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Privacy and Confidentiality
              </h2>
              <p>
                While we implement security measures to protect your data, this
                service does NOT provide the same confidentiality protections as
                therapy with licensed mental health professionals. There is no
                doctor-patient privilege.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Limitation of Liability
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="font-semibold mb-2">
                  IMPORTANT LIABILITY LIMITATION:
                </p>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIND GLEAM AND ITS
                  OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
                  ARISING FROM YOUR USE OF THIS SERVICE, INCLUDING BUT NOT
                  LIMITED TO ANY MENTAL HEALTH DECISIONS MADE BASED ON AI
                  RESPONSES.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p>
                THIS SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE
                ACCURATE, RELIABLE, OR SUITABLE FOR YOUR NEEDS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Mind Gleam from any
                claims, damages, or expenses arising from your use of this
                service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <p>
                For questions about these terms, please contact us at
                legal@mindgleam.app
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              By using Mind Gleam, you acknowledge that you have read and
              understood these terms and the associated risks.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
