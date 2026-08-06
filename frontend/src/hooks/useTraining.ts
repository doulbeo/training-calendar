import { useState, useEffect, useCallback } from 'react';
import { TrainingWeek } from '@/types/training';
import { defaultTrainingData } from '@/data/trainingData';

const STORAGE_KEY = 'training-calendar-data';

function loadData(): TrainingWeek[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return defaultTrainingData;
}

function saveData(data: TrainingWeek[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useTraining() {
  const [weeks, setWeeks] = useState<TrainingWeek[]>(() => loadData());

  useEffect(() => {
    saveData(weeks);
  }, [weeks]);

  const toggleComplete = useCallback((dayId: string) => {
    setWeeks(prev =>
      prev.map(week => ({
        ...week,
        days: week.days.map(day =>
          day.id === dayId ? { ...day, completed: !day.completed } : day
        ),
      }))
    );
  }, []);

  const resetData = useCallback(() => {
    setWeeks(defaultTrainingData);
  }, []);

  const progress = (() => {
    let total = 0;
    let done = 0;
    for (const week of weeks) {
      for (const day of week.days) {
        if (day.type !== 'rest') {
          total++;
          if (day.completed) done++;
        }
      }
    }
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  })();

  return { weeks, progress, toggleComplete, resetData };
}
