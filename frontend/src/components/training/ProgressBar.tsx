import { motion } from 'framer-motion';

interface ProgressBarProps {
  done: number;
  total: number;
  percent: number;
}

export function ProgressBar({ done, total, percent }: ProgressBarProps) {
  return (
    <div
      className="w-full"
      style={{ padding: 'var(--spacing-md)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-semibold tracking-wider uppercase"
          style={{
            fontFamily: 'var(--font-family-condensed)',
            fontSize: 'var(--font-size-label)',
            color: 'var(--muted-foreground)',
            letterSpacing: '0.05em',
          }}
        >
          训练进度
        </span>
        <span
          className="font-bold"
          style={{
            fontFamily: 'var(--font-family-condensed)',
            fontSize: 'var(--font-size-title)',
            color: 'var(--primary)',
          }}
        >
          {done}/{total}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: '6px',
          backgroundColor: 'var(--secondary)',
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--primary)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
