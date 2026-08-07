import { FadeIn } from '@/components/MotionPrimitives';
import { useTraining } from '@/hooks/useTraining';
import { CalendarView } from '@/components/training/CalendarView';
import { Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const { weeks } = useTraining();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'oklch(0.16 0.01 260 / 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{ padding: 'var(--spacing-md)', paddingTop: 'max(var(--spacing-md), env(safe-area-inset-top))' }}
          className="flex items-center justify-between"
        >
          <div>
            <h1
              className="font-bold uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-family-condensed)',
                fontSize: 'var(--font-size-headline)',
                color: 'var(--foreground)',
                letterSpacing: '0.04em',
              }}
            >
              训练日历
            </h1>
            <p style={{ fontSize: 'var(--font-size-label)', color: 'var(--muted-foreground)' }}>
              蹲推 & 硬拉后侧链 · 7/22 - 8/11
            </p>
          </div>

          <button
            onClick={() => navigate("/warmup")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            <Flame className="w-4 h-4" />
            热身清单
          </button>
        </div>
      </header>

      {/* Calendar */}
      <main style={{ padding: 'var(--spacing-md)', maxWidth: '600px', margin: '0 auto' }}>
        <FadeIn>
          <CalendarView weeks={weeks} />
        </FadeIn>

        <footer
          className="text-center"
          style={{
            padding: 'var(--spacing-2xl) var(--spacing-md)',
            color: 'var(--muted-foreground)',
            fontSize: 'var(--font-size-small)',
          }}
        >
          点击日历上的训练日查看动作详情
        </footer>
      </main>
    </div>
  );
}
