import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Wellness App 2024 | CBT-Based Self-Help & Thought Coaching',
  description: 'AI-powered wellness companion using evidence-based CBT principles. Guided self-reflection for anxiety support and emotional wellness. Start with 20 free messages.',
  keywords: [
    'best AI mental health app',
    'AI mental health app 2024',
    'AI wellness companion',
    'CBT-based wellness app',
    'mental health chatbot',
    'CBT self-help app',
    'depression support app',
    'anxiety help app'
  ],
  openGraph: {
    title: 'AI Wellness App 2024 | CBT-Based Self-Help',
    description: 'AI-powered wellness companion using CBT principles for anxiety support and emotional wellness. Educational self-help tools only.',
    images: ['/android-chrome-512x512.png'],
    type: 'website',
    url: 'https://mindgleam.app/ai-mental-health-app',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 