import { motion } from 'framer-motion';
import { hoverScaleVariants } from '@/utils/animations';

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function GradientButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
}: GradientButtonProps) {
  const baseClasses =
    'px-8 py-3 rounded-xl overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow';
  const gradientClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]'
      : 'border-2 border-gray-300';

  const ButtonContent = () => (
    <>
      <motion.div
        className={`absolute inset-0 ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]'
            : 'bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-yellow)] opacity-0 group-hover:opacity-20'
        }`}
        {...(variant === 'primary' && {
          animate: {
            x: ['-100%', '100%'],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          },
        })}
        {...(variant !== 'primary' && {
          transition: { duration: 0.3 },
        })}
      />
      <span
        className={`relative z-10 ${variant === 'primary' ? 'text-white' : 'text-gray-700'} font-semibold`}
      >
        {children}
      </span>
    </>
  );

  const buttonProps = {
    className: `${baseClasses} ${gradientClasses} ${className}`,
    variants: hoverScaleVariants,
    whileHover: 'hover',
    whileTap: 'tap',
  };

  if (href) {
    return (
      <motion.a href={href} {...buttonProps}>
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...buttonProps}>
      <ButtonContent />
    </motion.button>
  );
}
