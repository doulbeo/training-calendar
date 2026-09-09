import { useState, useEffect } from 'react';
import { defaultTrainingData } from '@/data/trainingData';
import { applyCompletion, COMPLETION_KEY, loadCompletion } from '@/lib/training-completion';

export function useTraining() {
  const [completion] = useState(() => {
    try {
      return loadCompletion(localStorage);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETION_KEY, JSON.stringify(completion));
    } catch {
      // Read-only plans remain available when browser storage is blocked or full.
    }
  }, [completion]);

  const weeks = applyCompletion(defaultTrainingData, completion);

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

  return { weeks, progress };
}
