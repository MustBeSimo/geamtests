import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mental Wellness Blog | CBT Self-Help Tips & Wellness Insights | Mind Gleam',
  description: 'Educational wellness content, CBT-based techniques, and AI wellness insights. Learn self-help strategies for anxiety, emotional wellness, and thought awareness.',
  keywords: [
    'mental health blog',
    'CBT techniques',
    'anxiety tips',
    'depression help',
    'mental wellness',
    'AI wellness blog',
    'cognitive behavioral therapy',
    'mental health tips'
  ],
  openGraph: {
    title: 'Mental Wellness Blog | CBT Self-Help Tips & Wellness Insights',
    description: 'Educational wellness content and CBT-based techniques for better emotional wellness and self-awareness.',
    images: ['/android-chrome-512x512.png'],
    type: 'website',
    url: 'https://mindgleam.app/blog',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 