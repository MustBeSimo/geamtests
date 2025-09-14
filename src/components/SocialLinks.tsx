'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  horizontal?: boolean;
}

export default function SocialLinks({
  links,
  className = '',
  horizontal = false,
}: SocialLinksProps) {
  // Filter to show only Twitter, Instagram, and Mindgleam
  const allowedPlatforms = ['instagram', 'twitter', 'mindgleam'];
  const filteredLinks = links.filter((link) =>
    allowedPlatforms.includes(link.platform.toLowerCase())
  );

  // Enhanced icons with better styling
  const getIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      twitter: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      mindgleam: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm-1.5 3c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm3 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM12 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 10h6v2H9v-2zm1.5 3c-.28 0-.5.22-.5.5s.22.5.5.5h3c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-3z" />
          <circle cx="7" cy="6" r="1.5" fill="currentColor" opacity="0.7" />
          <circle cx="17" cy="6" r="1" fill="currentColor" opacity="0.5" />
          <circle cx="19" cy="10" r="0.8" fill="currentColor" opacity="0.4" />
        </svg>
      ),
    };

    const lowerPlatform = platform.toLowerCase();
    return icons[lowerPlatform] || <span>{platform}</span>;
  };

  // Enhanced gradient colors
  const getPlatformGradient = (platform: string) => {
    const gradients: Record<string, string> = {
      instagram: 'from-pink-500 via-purple-500 to-orange-500',
      twitter: 'from-blue-400 via-blue-500 to-blue-600',
      mindgleam: 'from-teal-400 via-cyan-500 to-emerald-500',
    };

    const lowerPlatform = platform.toLowerCase();
    return gradients[lowerPlatform] || 'from-gray-400 to-slate-400';
  };

  // Enhanced hover colors
  const getPlatformHoverColor = (platform: string) => {
    const hoverColors: Record<string, string> = {
      instagram: 'hover:from-pink-600 hover:via-purple-600 hover:to-orange-600',
      twitter: 'hover:from-blue-500 hover:via-blue-600 hover:to-blue-700',
      mindgleam: 'hover:from-teal-500 hover:via-cyan-600 hover:to-emerald-600',
    };

    const lowerPlatform = platform.toLowerCase();
    return (
      hoverColors[lowerPlatform] || 'hover:from-gray-500 hover:to-slate-500'
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Horizontal layout for hero section
  if (horizontal) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {filteredLinks.map((link, index) => (
          <div key={index} className="relative group">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${getPlatformGradient(link.platform)} ${getPlatformHoverColor(link.platform)} text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110`}
            >
              <div className="scale-75">{getIcon(link.platform)}</div>
            </a>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Follow on {link.platform}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black/80"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`flex flex-col gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex justify-center gap-6"
        variants={containerVariants}
      >
        {filteredLinks.map((link, index) => (
          <motion.div key={index} variants={itemVariants}>
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getPlatformGradient(link.platform)} ${getPlatformHoverColor(link.platform)} text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
              variants={pulseVariants}
              animate="pulse"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                {getIcon(link.platform)}
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.a>

            {/* Platform name with animation */}
            <motion.div
              className="text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <motion.span
                className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                whileHover={{ scale: 1.05 }}
              >
                {link.platform}
              </motion.span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated follow text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.p
          className="text-xs text-gray-600 dark:text-gray-400 font-medium"
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: { duration: 3, repeat: Infinity },
          }}
        >
          Follow for daily wellness tips ✨
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
