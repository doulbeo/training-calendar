import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingDay, TrainingType } from '@/types/training';
import { Check, ChevronDown } from 'lucide-react';

interface DayCardProps {
  day: TrainingDay;
  onToggleComplete: (id: string) => void;
}

const typeConfig: Record<TrainingType, { label: string; bgClass: string; textClass: string }> = {
  squat: { label: '蹲推', bgClass: 'bg-squat', textClass: 'text-squat-foreground' },
  deadlift: { label: '硬拉', bgClass: 'bg-deadlift', textClass: 'text-deadlift-foreground' },
  rest: { label: '休息', bgClass: 'bg-rest', textClass: 'text-rest-foreground' },
};

const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function DayCard({ day, onToggleComplete }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[day.type];
  const isRest = day.type === 'rest';
  const weekDay = weekDayNames[day.dayOfWeek - 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--card)',
        borderLeft: isRest ? undefined : `4px solid var(--${day.type === 'squat' ? 'squat' : 'deadlift'})`,
        opacity: isRest ? 0.45 : day.completed ? 0.7 : 1,
        transition: 'opacity var(--duration-normal) var(--ease-default)',
        cursor: isRest ? 'default' : 'pointer',
      }}
      onClick={() => !isRest && setExpanded(!expanded)}
    >
      <div
        className="flex items-center gap-3"
        style={{ padding: 'var(--spacing-md)' }}
      >
        <div
          className="flex-shrink-0 font-bold"
          style={{
            fontFamily: 'var(--font-family-condensed)',
            fontSize: 'var(--font-size-title)',
            color: 'var(--foreground)',
            minWidth: '3.5rem',
          }}
        >
          {weekDay}
        </div>
        <div
          className="flex-shrink-0"
          style={{ fontSize: 'var(--font-size-small)', color: 'var(--muted-foreground)' }}
        >
          {day.date}
        </div>
        <div
          className={`flex-shrink-0 px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${config.bgClass} ${config.textClass}`}
          style={{ fontSize: 'var(--font-size-small)', fontFamily: 'var(--font-family-condensed)' }}
        >
          {config.label}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate" style={{ fontSize: 'var(--font-size-label)' }}>
            {day.label}
          </div>
          {!isRest && (
            <div style={{ fontSize: 'var(--font-size-small)', color: 'var(--muted-foreground)' }}>
              {day.exercises.length} 个动作
            </div>
          )}
        </div>
        {!isRest && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onToggleComplete(day.id); }}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: day.completed ? 'var(--success)' : 'var(--secondary)',
                color: day.completed ? 'var(--success-foreground)' : 'var(--muted-foreground)',
              }}
            >
              <Check size={14} strokeWidth={3} />
            </motion.button>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} style={{ color: 'var(--muted-foreground)' }} />
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && !isRest && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{ padding: `0 var(--spacing-md) var(--spacing-md)`, borderTop: '1px solid var(--border)' }}
            >
              <div style={{ paddingTop: 'var(--spacing-sm)' }}>
                {day.exercises.map((ex, idx) => (
                  <div key={ex.id}>
                    <div
                      className="flex items-center gap-2"
                      style={{ padding: 'var(--spacing-xs) 0 2px 0' }}
                    >
                      <span
                        className="flex-shrink-0 font-bold tabular-nums"
                        style={{ fontSize: 'var(--font-size-small)', color: 'var(--muted-foreground)', width: '1.25rem' }}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className="flex-1 min-w-0 font-semibold"
                        style={{ fontSize: 'var(--font-size-label)', color: 'var(--foreground)' }}
                      >
                        {ex.name}
                      </span>
                    </div>
                    {ex.lines.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-center gap-2"
                        style={{
                          padding: '2px 0 2px calc(1.25rem + var(--spacing-xs))',
                          fontSize: 'var(--font-size-label)',
                        }}
                      >
                        <span className="tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                          {line.sets}×{line.reps}
                        </span>
                        <span className="tabular-nums font-semibold" style={{ color: 'var(--primary)' }}>
                          {line.weight}
                        </span>
                        {line.notes && (
                          <span
                            style={{
                              fontSize: 'var(--font-size-small)',
                              color: 'var(--warning)',
                              marginLeft: 'var(--spacing-xs)',
                            }}
                          >
                            {line.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
