'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export function Logo({ 
  className, 
  size = 'md', 
  animated = false, 
  theme = 'auto' 
}: LogoProps) {
  const sizeConfig = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-5 h-5' },
    md: { container: 'w-12 h-12', text: 'text-lg', icon: 'w-7 h-7' },
    lg: { container: 'w-16 h-16', text: 'text-2xl', icon: 'w-10 h-10' },
    xl: { container: 'w-24 h-24', text: 'text-4xl', icon: 'w-16 h-16' },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      className={cn(
        'relative flex items-center space-x-3',
        className
      )}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={animated ? { duration: 0.8, ease: "easeOut" } : undefined}
    >
      {/* Logo Icon */}
      <motion.div 
        className={cn(
          'relative flex items-center justify-center rounded-xl',
          config.container,
          'bg-gradient-to-br from-green-500 to-teal-600',
          'shadow-lg'
        )}
        whileHover={animated ? { scale: 1.05, rotateY: 5 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect */}
        {animated && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-xl bg-green-400',
              'blur-lg'
            )}
            animate={{
              scale: [0.8, 1.2, 1],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Main Icon SVG */}
        <svg
          className={cn(config.icon, 'text-white relative z-10')}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stellar/Forge Symbol */}
          <motion.path
            d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 1.2, ease: "easeInOut" } : undefined}
          />
          
          {/* Inner geometric pattern */}
          <motion.path
            d="M12 7L13.5 10.5L17 12L13.5 13.5L12 17L10.5 13.5L7 12L10.5 10.5L12 7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.2)"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 1.2, delay: 0.3, ease: "easeInOut" } : undefined}
          />
          
          {/* Center dot */}
          <motion.circle
            cx="12"
            cy="12"
            r="1.5"
            fill="currentColor"
            initial={animated ? { scale: 0, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            transition={animated ? { duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 } : undefined}
          />
        </svg>
      </motion.div>

      {/* Logo Text */}
      <motion.div 
        className="flex flex-col"
        initial={animated ? { x: -20, opacity: 0 } : undefined}
        animate={animated ? { x: 0, opacity: 1 } : undefined}
        transition={animated ? { duration: 0.8, delay: 0.2, ease: "easeOut" } : undefined}
      >
        <div className={cn(
          'font-bold tracking-tight',
          config.text,
          theme === 'light' ? 'text-white' :
          theme === 'dark' ? 'text-slate-900' :
          'text-slate-900 dark:text-white'
        )}>
          <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Stellar
          </span>
          <span className={cn(
            theme === 'light' ? 'text-white' :
            theme === 'dark' ? 'text-slate-900' :
            'text-slate-900 dark:text-white'
          )}>
            Forge
          </span>
        </div>
        
        {size !== 'sm' && (
          <motion.div 
            className={cn(
              'text-xs font-medium tracking-wider uppercase',
              theme === 'light' ? 'text-white/80' :
              theme === 'dark' ? 'text-slate-600' :
              'text-slate-600 dark:text-slate-400'
            )}
            initial={animated ? { opacity: 0, y: 5 } : undefined}
            animate={animated ? { opacity: 1, y: 0 } : undefined}
            transition={animated ? { duration: 0.6, delay: 0.5 } : undefined}
          >
            Analytics
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
