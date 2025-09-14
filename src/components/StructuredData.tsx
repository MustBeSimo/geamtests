import Script from 'next/script';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mind Gleam",
    "description": "AI-powered mental wellness and thought coaching app using evidence-based CBT techniques",
    "url": "https://www.mindgleam.app",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "20 free messages available"
    },
    "featureList": [
      "AI-powered thought coaching",
      "Cognitive Behavioral Therapy (CBT)",
      "Mood tracking",
      "Private journaling",
      "Personalized mental health support",
      "24/7 availability"
    ],
    "author": {
      "@type": "Organization",
      "name": "Mind Gleam"
    },
    "screenshot": "https://www.mindgleam.app/android-chrome-512x512.png",
    "softwareVersion": "1.0",
    "releaseNotes": "Initial release with AI companions, mood tracking, and CBT-based guidance"
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 