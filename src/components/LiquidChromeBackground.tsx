'use client';

import React from 'react';

export default function LiquidChromeBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-[#1A1625] transition-colors duration-300" />
      <div className="liquid-chrome-background">
        <style jsx>{`
          .liquid-chrome-background {
            position: absolute;
            inset: -50%;
            width: 200%;
            height: 200%;
            transform-origin: center;
            animation: rotate 15s linear infinite;
          }

          .liquid-chrome-background::before,
          .liquid-chrome-background::after {
            content: '';
            position: absolute;
            inset: 0;
            background-color: transparent;
          }

          .liquid-chrome-background::before {
            background: radial-gradient(
              circle at center,
              rgba(255, 126, 179, 0.25) 0%,
              rgba(216, 180, 254, 0.2) 40%,
              rgba(116, 192, 252, 0.15) 80%,
              rgba(160, 240, 188, 0.1) 100%
            );
            filter: blur(40px);
            mix-blend-mode: multiply;
          }

          .liquid-chrome-background::after {
            background: radial-gradient(
              circle at 70% 40%,
              rgba(160, 240, 188, 0.2) 0%,
              rgba(255, 126, 179, 0.25) 50%,
              rgba(216, 180, 254, 0.3) 100%
            );
            filter: blur(40px);
            mix-blend-mode: multiply;
            animation: rotate 20s linear infinite reverse;
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.2);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          :global(.dark) .liquid-chrome-background::before,
          :global(.dark) .liquid-chrome-background::after {
            mix-blend-mode: screen;
            filter: blur(40px) brightness(0.9);
          }
        `}</style>
      </div>

      {/* Add floating elements for anime-inspired decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <style jsx>{`
          .floating-element {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            opacity: 0.6;
            filter: blur(15px);
          }

          .floating-star {
            position: absolute;
            width: 15px;
            height: 15px;
            opacity: 0.9;
            background-color: white;
            clip-path: polygon(
              50% 0%,
              61% 35%,
              98% 35%,
              68% 57%,
              79% 91%,
              50% 70%,
              21% 91%,
              32% 57%,
              2% 35%,
              39% 35%
            );
          }

          .element-1 {
            top: 15%;
            left: 10%;
            background-color: var(--neon-pink);
            animation: float 8s ease-in-out infinite;
          }

          .element-2 {
            top: 70%;
            left: 85%;
            background-color: var(--neon-blue);
            animation: float 10s ease-in-out infinite 1s;
          }

          .element-3 {
            top: 80%;
            left: 25%;
            background-color: var(--neon-mint);
            animation: float 12s ease-in-out infinite 0.5s;
          }

          .element-4 {
            top: 30%;
            right: 15%;
            background-color: var(--neon-purple);
            animation: float 9s ease-in-out infinite 1.5s;
          }

          .element-5 {
            top: 60%;
            right: 35%;
            background-color: var(--neon-yellow);
            animation: float 11s ease-in-out infinite 2s;
          }

          .star-1 {
            top: 25%;
            right: 15%;
            animation: twinkle 2s ease-in-out infinite;
          }

          .star-2 {
            top: 40%;
            left: 20%;
            animation: twinkle 2.5s ease-in-out infinite 0.5s;
          }

          .star-3 {
            bottom: 30%;
            right: 30%;
            animation: twinkle 3s ease-in-out infinite 1s;
          }

          .star-4 {
            top: 15%;
            left: 35%;
            animation: twinkle 2.2s ease-in-out infinite 1.5s;
          }

          .star-5 {
            bottom: 25%;
            left: 45%;
            animation: twinkle 2.7s ease-in-out infinite 0.7s;
          }

          .star-6 {
            top: 55%;
            right: 25%;
            animation: twinkle 2.4s ease-in-out infinite 1.2s;
          }

          .element-6 {
            top: 45%;
            left: 55%;
            background-color: var(--neon-pink);
            animation: float 9.5s ease-in-out infinite 1.8s;
          }

          .element-7 {
            top: 20%;
            left: 75%;
            background-color: var(--neon-blue);
            animation: float 10.5s ease-in-out infinite 0.3s;
          }

          .element-8 {
            bottom: 15%;
            right: 45%;
            background-color: var(--neon-purple);
            animation: float 11.5s ease-in-out infinite 1.2s;
          }

          .element-9 {
            top: 35%;
            left: 40%;
            background-color: var(--neon-mint);
            animation: float 8.5s ease-in-out infinite 2.5s;
          }

          .star-7 {
            top: 75%;
            left: 65%;
            animation: twinkle 2.3s ease-in-out infinite 1.8s;
          }

          .star-8 {
            top: 85%;
            right: 10%;
            animation: twinkle 2.6s ease-in-out infinite 0.9s;
          }

          .star-9 {
            top: 10%;
            right: 45%;
            animation: twinkle 2.8s ease-in-out infinite 1.4s;
          }

          .star-10 {
            bottom: 45%;
            left: 15%;
            animation: twinkle 2.1s ease-in-out infinite 2.2s;
          }

          .star-11 {
            bottom: 15%;
            left: 80%;
            animation: twinkle 2.9s ease-in-out infinite 0.4s;
          }

          .star-12 {
            top: 50%;
            right: 75%;
            animation: twinkle 2.4s ease-in-out infinite 1.6s;
          }

          @keyframes float {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            33% {
              transform: translateY(-40px) translateX(20px) rotate(120deg);
            }
            66% {
              transform: translateY(20px) translateX(-30px) rotate(240deg);
            }
            100% {
              transform: translateY(0) translateX(0) rotate(360deg);
            }
          }

          @keyframes twinkle {
            0% {
              opacity: 0.3;
              transform: scale(0.8) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1.3) rotate(180deg);
            }
            100% {
              opacity: 0.3;
              transform: scale(0.8) rotate(360deg);
            }
          }
        `}</style>

        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="floating-element element-4"></div>
        <div className="floating-element element-5"></div>
        <div className="floating-element element-6"></div>
        <div className="floating-element element-7"></div>
        <div className="floating-element element-8"></div>
        <div className="floating-element element-9"></div>
        <div className="floating-star star-1"></div>
        <div className="floating-star star-2"></div>
        <div className="floating-star star-3"></div>
        <div className="floating-star star-4"></div>
        <div className="floating-star star-5"></div>
        <div className="floating-star star-6"></div>
        <div className="floating-star star-7"></div>
        <div className="floating-star star-8"></div>
        <div className="floating-star star-9"></div>
        <div className="floating-star star-10"></div>
        <div className="floating-star star-11"></div>
        <div className="floating-star star-12"></div>
      </div>
    </div>
  );
}
