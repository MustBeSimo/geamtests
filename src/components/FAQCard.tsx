import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Mind Gleam and how does it work?",
    answer: "Mind Gleam is an AI-powered holistic wellness app that supports both your mental and physical wellbeing. Our AI companions (Gigi, Vee, and Lumo) help you explore thought patterns, develop healthy movement habits, practice mindfulness, and learn evidence-based mind-body wellness strategies. This is NOT therapy, medical advice, or professional health treatment."
  },
  {
    question: "Is Mind Gleam a replacement for therapy or medical care?",
    answer: "❌ NO - Mind Gleam is NOT a replacement for professional therapy, medical care, or mental health treatment. We are an educational wellness app only. If you're experiencing mental health issues, please consult with licensed mental health professionals, your doctor, or contact crisis services immediately."
  },
  {
    question: "What are the limitations and risks I should know about?",
    answer: "⚠️ IMPORTANT LIMITATIONS: This AI may provide inaccurate, incomplete, or inappropriate responses. It cannot diagnose conditions, provide medical advice, or handle crisis situations. Do not rely on this app for urgent mental health needs. Always seek professional help for serious mental health concerns, suicidal thoughts, or medical emergencies."
  },
  {
    question: "Who should NOT use Mind Gleam?",
    answer: "🚫 Do not use if you are: Under 18, in a mental health crisis, experiencing suicidal thoughts, have severe mental health conditions requiring professional care, or are seeking medical/therapeutic advice. This app is for educational wellness support only for adults 18+ who are not in crisis."
  },
  {
    question: "What should I do in a mental health emergency?",
    answer: "🚨 CRISIS RESOURCES: If you're having suicidal thoughts or in crisis, contact emergency services immediately: • US: 988 (Suicide & Crisis Lifeline) • Australia: 13 11 14 (Lifeline) • UK: 116 123 (Samaritans) • Emergency: 911/000. Do NOT use this app for crisis situations."
  },
  {
    question: "How do the AI wellness conversations work?",
    answer: "You get 3 free demo messages to try the AI, then 20 free messages when you sign up with Google. After that, you can purchase 200 more messages + 60 mood check-ins for $4.99 (Plus plan). These are AI-generated responses for educational purposes only - NOT professional therapy or medical advice. The AI provides holistic wellness guidance combining mental health techniques with physical wellness practices, but cannot replace professional healthcare."
  },
  {
    question: "What's included in my free account?",
    answer: "When you sign up with Google, you get: • 20 free chat messages • 5 mood check-ins with personalized reports • Access to all 3 AI companions (Gigi, Vee, Lumo) • Free CBT guides and resources • Basic progress tracking. No credit card required!"
  },
  {
    question: "How do mood check-ins work?",
    answer: "Mood check-ins let you track your emotional state and receive personalized insights. Select your mood emoji, rate your feelings 1-10, add optional notes, and get a personalized report with CBT techniques, affirmations, and action steps. You can also download daily reports or generate weekly/monthly summaries."
  },
  {
    question: "Is my data private and secure?",
    answer: "We prioritize your privacy with encrypted conversations. However, remember that this is an AI system, not a human therapist. There is no doctor-patient confidentiality. For truly confidential mental health support, please consult with licensed mental health professionals."
  },
  {
    question: "What are your legal disclaimers?",
    answer: "📋 LEGAL DISCLAIMER: Mind Gleam provides educational content only. We make no medical claims and provide no professional mental health services. Use at your own risk. We are not liable for any decisions made based on AI responses. This service is provided 'as is' without warranties. See our Terms of Service for full legal terms."
  },
  {
    question: "How do I get started safely?",
    answer: "Sign in with Google to access 20 free educational conversations. Remember: This is supplemental wellness education, not therapy. Continue seeing your healthcare providers and mental health professionals. Never stop prescribed treatments without consulting your doctor."
  },
  {
    question: "How can I get support or report issues?",
    answer: "📧 SUPPORT: For technical support, feature requests, or to report any issues, please email us at simone@w230.net. We aim to respond within 24-48 hours. For urgent mental health support, please contact crisis services immediately - do not email for emergency situations."
  }
];



const FAQCard = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl backdrop-blur-sm shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Important Information & FAQ</h2>
      
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-colors duration-300"
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left"
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <span className="text-white font-medium">{faq.question}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-5 h-5 text-purple-400" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 text-gray-300 bg-gray-800/50">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQCard; 