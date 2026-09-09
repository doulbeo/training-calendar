import type { TrainingWeek } from '@/types/training';

export const COMPLETION_KEY = 'training-calendar-completion-v1';
export const LEGACY_PLAN_KEY = 'training-calendar-data-v2';
export type CompletionRecords = Record<string, boolean>;

function readJson(storage: Pick<Storage, 'getItem'>, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadCompletion(storage: Pick<Storage, 'getItem'>): CompletionRecords {
  const saved = readJson(storage, COMPLETION_KEY);
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    return Object.fromEntries(Object.entries(saved).filter(([, value]) => typeof value === 'boolean'));
  }

  // Import completion flags only. Never restore cached exercises or dates.
  const legacy = readJson(storage, LEGACY_PLAN_KEY);
  const records: CompletionRecords = {};
  if (Array.isArray(legacy)) {
    for (const week of legacy) {
      if (!Array.isArray(week?.days)) continue;
      for (const day of week.days) {
        if (typeof day?.id === 'string' && typeof day.completed === 'boolean') {
          Object.defineProperty(records, day.id, {
            value: day.completed, enumerable: true, configurable: true, writable: true,
          });
        }
      }
    }
  }
  return records;
}

export function applyCompletion(plan: TrainingWeek[], records: CompletionRecords): TrainingWeek[] {
  return plan.map(week => ({
    ...week,
    days: week.days.map(day => ({
      ...day,
      completed: day.type !== 'rest' && Object.hasOwn(records, day.id) && records[day.id] === true,
    })),
  }));
}
