import type { ExerciseLine, TrainingDay, TrainingWeek } from '@/types/training';

export interface HistoricalExercisePlan {
  dayId: string;
  date: string;
  lines: ExerciseLine[];
}

function dateValue(date: string): number {
  const match = date.match(/(\d+)月(\d+)日/);
  if (!match) return Number.NEGATIVE_INFINITY;

  return new Date(2026, Number(match[1]) - 1, Number(match[2])).getTime();
}

/**
 * Returns plans for the same action strictly before the selected training day.
 * The published plan is the source of truth, so future rows never appear here.
 */
export function getHistoricalPlans(
  weeks: TrainingWeek[],
  currentDay: TrainingDay,
  exerciseName: string,
): HistoricalExercisePlan[] {
  const currentDate = dateValue(currentDay.date);
  const normalizedName = exerciseName.trim();

  return weeks
    .flatMap((week) => week.days)
    .filter((day) => dateValue(day.date) < currentDate)
    .flatMap((day) => day.exercises
      .filter((exercise) => exercise.name.trim() === normalizedName)
      .map((exercise) => ({
        dayId: day.id,
        date: day.date,
        lines: exercise.lines,
      })))
    .sort((a, b) => dateValue(b.date) - dateValue(a.date));
}
