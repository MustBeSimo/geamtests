import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Font configurations
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "Gigi Glitz | Bold Bodies. Sharp Minds. Digital Queens.",
  description: "Join Gigi's world of crypto, confidence, and cardio. A digital queen empowering the next generation of slayers.",
  keywords: ["crypto for women", "confidence coach", "vaporwave fit aesthetic", "NFT empowerment"],
  creator: "HeyItsGigiAI",
  openGraph: {
    title: "Gigi Glitz | The Slayer Site",
    description: "Bold Bodies. Sharp Minds. Digital Queens.",
    url: "https://gigi.w230.ai",
    siteName: "Gigi Glitz",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gigi Glitz - Digital Queen",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
