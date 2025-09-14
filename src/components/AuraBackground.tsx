import React from 'react';

export default function AuraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 w-[120vw] h-[120vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="aura-gradient" />
      </div>
      <style jsx>{`
        .aura-gradient {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 60% 40%,
            rgba(236, 72, 154, 0.3) 0%,
            rgba(124, 58, 237, 0.2) 40%,
            rgba(255, 255, 255, 0.05) 100%
          );
          filter: blur(80px);
          animation: auraMove 16s ease-in-out infinite alternate;
        }
        @keyframes auraMove {
          0% {
            transform: scale(1) translateY(0px) translateX(0px);
          }
          100% {
            transform: scale(1.1) translateY(-40px) translateX(40px);
          }
        }
      `}</style>
    </div>
  );
}
