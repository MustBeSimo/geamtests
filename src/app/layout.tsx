import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { metadata } from './metadata';
import StructuredData from '@/components/StructuredData';

// Dynamically load client-only components
const ClientLayout = dynamic(() => import('@/components/ClientLayout'), { ssr: false });
const SimpleBackground = dynamic(() => import('@/components/SimpleBackground'), { ssr: false });
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter'
});

const manrope = Manrope({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-manrope'
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are loaded via next/font for optimal performance */}
        
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GigiW" />
        <link rel="apple-touch-icon" href="/icons/ios/192.png" />
        <link rel="apple-touch-startup-image" href="/splash.png" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-31WZL1Q5HX"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-31WZL1Q5HX');
          `}
        </Script>
        
        {/* Google Ads Conversion Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-947077315"
          strategy="lazyOnload"
        />
        <Script id="google-ads" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-947077315');
          `}
        </Script>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-inter min-h-screen antialiased overflow-x-hidden bg-white dark:bg-gray-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-300`}>
        <SimpleBackground />
        <ErrorBoundary
          fallbackTitle="Application Error"
          fallbackDescription="We're experiencing technical difficulties. Please try refreshing the page."
          showReload={true}
        >
          <ClientLayout>
            {children}
          </ClientLayout>
        </ErrorBoundary>
        {/* Register service worker (next-pwa outputs sw.js in /public) */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}