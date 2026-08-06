export interface ExerciseLine {
  id: string;
  sets: string;
  reps: string;
  weight: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  lines: ExerciseLine[];
}

export type TrainingType = 'squat' | 'deadlift' | 'rest';

export interface TrainingDay {
  id: string;
  date: string;
  week: number;
  dayOfWeek: number;
  type: TrainingType;
  label: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface TrainingWeek {
  weekNumber: number;
  dateRange: string;
  days: TrainingDay[];
}
