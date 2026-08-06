import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainingWeek, TrainingDay } from '@/types/training';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  weeks: TrainingWeek[];
}

const weekDayLabels = ['一', '二', '三', '四', '五', '六', '日'];

export function CalendarView({ weeks }: CalendarViewProps) {
  const allDays = weeks.flatMap((w) => w.days);

  // Collect all months that have training data
  const months = useMemo(() => {
    const ms: { year: number; month: number; label: string }[] = [];
    for (const day of allDays) {
      const parts = day.date.match(/(\d+)月(\d+)日/);
      if (!parts) continue;
      const m = parseInt(parts[1]);
      const y = 2026;
      const key = `${y}-${m}`;
      if (!ms.find((x) => `${x.year}-${x.month}` === key)) {
        ms.push({ year: y, month: m, label: `${m}月` });
      }
    }
    return ms.sort((a, b) => a.month - b.month);
  }, [allDays]);

  // Real today based on system time
  const now = new Date();
  const todayMonth = now.getMonth() + 1; // 1-12
  const todayDate = now.getDate();
  const todayStr = `${todayMonth}月${todayDate}日`;

  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(() => {
    return allDays.find((d) => d.date === todayStr && d.type !== 'rest') || null;
  });

  // Find which month contains today
  const initialMonth = useMemo(() => {
    const idx = months.findIndex((m) => m.month === todayMonth);
    return idx >= 0 ? idx : 0;
  }, [months]);

  const [monthIndex, setMonthIndex] = useState(initialMonth);
  const [direction, setDirection] = useState(0);

  const currentMonth = months[monthIndex] || months[0];
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < months.length - 1;

  const goTo = (delta: number) => {
    const next = monthIndex + delta;
    if (next >= 0 && next < months.length) {
      setDirection(delta);
      setMonthIndex(next);
    }
  };

  // Build days for current month view
  const weeks2D = useMemo(() => {
    if (!currentMonth) return [];
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: { date: Date; dayData?: TrainingDay; isPadding: boolean }[] = [];

    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month - 1, -startOffset + i + 1);
      days.push({ date: d, isPadding: true });
    }

    let d = 0;
    for (let i = 1; i <= lastDay.getDate(); i++) {
      d = i;
      const date = new Date(year, month - 1, i);
      const ds = `${month}月${i}日`;
      const found = allDays.find((td) => td.date === ds);
      days.push({ date, dayData: found, isPadding: false });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(year, month - 1, d + i);
        days.push({ date, isPadding: true });
      }
    }

    const result: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [currentMonth, allDays]);

  const handleDayClick = (dayData?: TrainingDay) => {
    if (dayData && dayData.type !== 'rest') {
      setSelectedDay(selectedDay?.id === dayData.id ? null : dayData);
    } else if (dayData?.type === 'rest') {
      setSelectedDay(null);
    }
  };

  if (months.length === 0) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div>
      {/* Month header */}
      <div
        className="flex items-center justify-between mb-3"
        style={{ padding: '0 var(--spacing-xs)' }}
      >
        <button
          onClick={() => goTo(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{
            color: canGoPrev ? 'var(--foreground)' : 'var(--rest-foreground)',
            backgroundColor: canGoPrev ? 'var(--secondary)' : 'transparent',
          }}
          disabled={!canGoPrev}
        >
          <ChevronLeft size={20} />
        </button>
        <span
          className="font-bold"
          style={{
            fontFamily: 'var(--font-family-condensed)',
            fontSize: 'var(--font-size-title)',
            color: 'var(--foreground)',
          }}
        >
          {currentMonth.label}
        </span>
        <button
          onClick={() => goTo(1)}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{
            color: canGoNext ? 'var(--foreground)' : 'var(--rest-foreground)',
            backgroundColor: canGoNext ? 'var(--secondary)' : 'transparent',
          }}
          disabled={!canGoNext}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar card */}
      <div className="rounded-lg overflow-hidden relative" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        {/* Week day headers (fixed) */}
        <div className="grid grid-cols-7">
          {weekDayLabels.map((label, i) => (
            <div
              key={i}
              className="text-center font-semibold py-2"
              style={{
                fontSize: 'var(--font-size-label)',
                color: i >= 5 ? 'var(--destructive)' : 'var(--muted-foreground)',
                fontFamily: 'var(--font-family-condensed)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar body with swipe animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.label}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {weeks2D.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7" style={{ borderTop: '1px solid var(--border)' }}>
                {week.map((day, di) => {
                  const hasTraining = !!day.dayData && day.dayData.type !== 'rest';
                  const isRest = day.dayData?.type === 'rest';
                  const isSelected = selectedDay?.id === day.dayData?.id;
                  const isToday = !day.isPadding && day.date.getDate() === todayDate && day.date.getMonth() + 1 === todayMonth;

                  const numberColor = isSelected && isToday
                    ? 'var(--primary-foreground)'
                    : isToday
                    ? 'var(--primary)'
                    : hasTraining
                    ? day.dayData!.type === 'squat'
                      ? 'var(--squat)'
                      : 'var(--deadlift)'
                    : isRest
                    ? 'var(--muted-foreground)'
                    : 'var(--foreground)';

                  return (
                    <motion.div
                      key={di}
                      whileTap={hasTraining ? { scale: 0.93 } : undefined}
                      className="text-center relative flex items-center justify-center"
                      style={{
                        padding: 'var(--spacing-xs) var(--spacing-xs)',
                        fontFamily: 'var(--font-family-condensed)',
                        opacity: day.isPadding ? 0.12 : 1,
                        cursor: hasTraining ? 'pointer' : 'default',
                        minHeight: '3rem',
                        borderRight: di < 6 ? '1px solid var(--border)' : undefined,
                      }}
                      onClick={() => !day.isPadding && handleDayClick(day.dayData)}
                    >
                      <div
                        className="relative flex items-center justify-center"
                        style={{ width: '100%', height: '2.4rem' }}
                      >
                        {/* Today ring */}
                        {isToday && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: '2.2rem',
                              height: '2.2rem',
                              border: '2px solid var(--primary)',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )}

                        {/* Selected background */}
                        {isSelected && !isToday && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: '2.2rem',
                              height: '2.2rem',
                              backgroundColor: 'var(--secondary)',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )}

                        {/* Selected + Today */}
                        {isSelected && isToday && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: '2.2rem',
                              height: '2.2rem',
                              backgroundColor: 'var(--primary)',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )}

                        <span
                          className="relative z-10 font-bold"
                          style={{
                            fontSize: 'var(--font-size-body)',
                            color: numberColor,
                          }}
                        >
                          {day.date.getDate()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Month dots indicator */}
      {months.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {months.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === monthIndex ? '16px' : '6px',
                height: '6px',
                backgroundColor: i === monthIndex ? 'var(--primary)' : 'var(--border)',
                transition: 'all var(--duration-normal) var(--ease-default)',
              }}
            />
          ))}
        </div>
      )}

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-lg mt-3"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid var(--${selectedDay.type === 'squat' ? 'squat' : 'deadlift'})`,
                padding: 'var(--spacing-md)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-bold"
                  style={{ fontFamily: 'var(--font-family-condensed)', fontSize: 'var(--font-size-title)' }}
                >
                  {selectedDay.date}
                </span>
                <span
                  className="px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                  style={{
                    fontSize: 'var(--font-size-small)',
                    fontFamily: 'var(--font-family-condensed)',
                    backgroundColor: selectedDay.type === 'squat' ? 'var(--squat)' : 'var(--deadlift)',
                    color: 'var(--squat-foreground)',
                  }}
                >
                  {selectedDay.type === 'squat' ? '蹲推' : '硬拉'}
                </span>
              </div>

              {selectedDay.exercises.map((ex, idx) => (
                <div key={ex.id} style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <div
                    className="flex items-center gap-2 font-semibold"
                    style={{
                      fontSize: 'var(--font-size-label)',
                      color: 'var(--foreground)',
                      paddingBottom: '2px',
                    }}
                  >
                    <span
                      className="flex-shrink-0 tabular-nums"
                      style={{ fontSize: 'var(--font-size-small)', color: 'var(--muted-foreground)' }}
                    >
                      {idx + 1}.
                    </span>
                    {ex.name}
                  </div>
                  {ex.lines.map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center gap-2"
                      style={{
                        paddingLeft: '1.5rem',
                        fontSize: 'var(--font-size-label)',
                        paddingBottom: '1px',
                      }}
                    >
                      <span className="tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                        {line.sets}×{line.reps}
                      </span>
                      <span className="tabular-nums font-semibold" style={{ color: 'var(--primary)' }}>
                        {line.weight}
                      </span>
                      {line.notes && (
                        <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--warning)' }}>
                          {line.notes}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
