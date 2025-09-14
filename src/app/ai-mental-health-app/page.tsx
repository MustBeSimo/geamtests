'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import DemoChat from '@/components/DemoChat';
import FAQCard from '@/components/FAQCard';
import Footer from '@/components/Footer';
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer';

export default function AIMentalHealthAppPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<'gigi' | 'vee' | 'lumo'>('gigi');
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false);

  const handleStartDemo = (goal?: string) => {
    setIsDemoChatOpen(true);
  };

  const handleAvatarChange = (avatar: 'gigi' | 'vee' | 'lumo') => {
    setSelectedAvatar(avatar);
  };

  return (
    <div className="min-h-screen">
      <Hero 
        onStartDemo={handleStartDemo}
        selectedAvatar={selectedAvatar}
        onAvatarChange={handleAvatarChange}
      />
      
      {/* Compliance Disclaimer */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <ComplianceDisclaimer />
      </section>
      
      {/* SEO Content Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI-Powered Wellness & Self-Help App for 2024
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <h2>Why Choose Mind Gleam as Your Wellness Companion?</h2>
          <p>
            Mind Gleam is an AI-powered wellness app that provides guided self-reflection using 
            evidence-based Cognitive Behavioral Therapy (CBT) principles. Our AI companions help you 
            explore thought patterns and develop coping strategies for emotional wellness 24/7.
          </p>
          
          <h3>Key Features of Our AI Wellness App:</h3>
          <ul>
            <li><strong>Free Wellness Conversations:</strong> Start with 20 free messages to explore self-help techniques</li>
            <li><strong>Evidence-Based CBT Principles:</strong> Guided self-reflection based on cognitive behavioral techniques</li>
            <li><strong>Personalized Guidance:</strong> AI that adapts to your unique wellness journey</li>
            <li><strong>Mood Tracking:</strong> Monitor your emotional wellness patterns</li>
            <li><strong>Private Journaling:</strong> Secure, confidential space for self-reflection</li>
            <li><strong>24/7 Availability:</strong> Get wellness support whenever you need it</li>
          </ul>
          
          <h3>How Our AI Wellness App Works:</h3>
          <p>
            Our AI wellness app uses natural language processing to understand your thoughts, 
            feelings, and challenges. The AI companions provide science-backed prompts for self-reflection, 
            thought pattern awareness, and emotional wellness based on CBT principles.
          </p>
          
          <h3>Perfect for:</h3>
          <ul>
            <li>Anxiety and stress management</li>
            <li>Depression support and recovery</li>
            <li>Negative thought pattern transformation</li>
            <li>Emotional wellness and mindfulness</li>
            <li>Self-improvement and personal growth</li>
          </ul>
        </div>
      </section>
      
      <DemoChat 
        isOpen={isDemoChatOpen}
        onClose={() => setIsDemoChatOpen(false)}
        selectedAvatar={selectedAvatar}
      />
      <FAQCard />
      <Footer />
    </div>
  );
} 