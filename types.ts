
export enum TaskType {
  VOCAB = 'VOCAB',
  GRAMMAR = 'GRAMMAR',
  LC = 'LC',
  RC = 'RC',
  MOCK_TEST = 'MOCK_TEST'
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  isCompleted: boolean;
  duration: number; // in minutes
}

export interface DailyPlan {
  day: number;
  theme: string;
  tasks: Task[];
  completedCount: number;
}

export interface UserStats {
  currentDay: number;
  totalCompletedTasks: number;
  weeklyProgress: { day: string; score: number }[];
  weakPoints: string[];
}
