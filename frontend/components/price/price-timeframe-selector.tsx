'use client';

import { cn } from '@/lib/utils';

interface TimeframeSelectorProps {
  timeframe: '1h' | '24h' | '7d' | '30d';
  onTimeframeChange: (timeframe: '1h' | '24h' | '7d' | '30d') => void;
  className?: string;
}

const timeframes = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' }
] as const;

export function PriceTimeframeSelector({ 
  timeframe, 
  onTimeframeChange, 
  className 
}: TimeframeSelectorProps) {
  return (
    <div className={cn("flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1", className)}>
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onTimeframeChange(tf.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            timeframe === tf.value
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}