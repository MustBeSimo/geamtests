'use client';

import { useEffect, useState } from 'react';

export default function SimpleBackground() {
  const [colorIndex, setColorIndex] = useState(0);

  const colors = [
    'from-blue-500/10 to-purple-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-pink-500/10 to-red-500/10',
    'from-red-500/10 to-orange-500/10',
    'from-orange-500/10 to-yellow-500/10',
    'from-yellow-500/10 to-green-500/10',
    'from-green-500/10 to-teal-500/10',
    'from-teal-500/10 to-blue-500/10',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [colors.length]);

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={`w-full h-full bg-gradient-to-br ${colors[colorIndex]} transition-all duration-5000 ease-in-out`}
      />
    </div>
  );
}
