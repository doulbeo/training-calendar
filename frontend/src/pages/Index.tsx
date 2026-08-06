import { FadeIn } from '@/components/MotionPrimitives';
import { useTraining } from '@/hooks/useTraining';
import { CalendarView } from '@/components/training/CalendarView';

export default function Index() {
  const { weeks } = useTraining();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{
          backgroundColor: 'oklch(0.16 0.01 260 / 0.92)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ padding: 'var(--spacing-md)' }}>
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
