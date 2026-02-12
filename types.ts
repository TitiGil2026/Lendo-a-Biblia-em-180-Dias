
export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'Old' | 'New';
}

export interface ReadingItem {
  book: string;
  startChapter: number;
  endChapter: number;
}

export interface DayPlan {
  day: number;
  readings: ReadingItem[];
  isCompleted: boolean;
}

export interface UserStats {
  streak: number;
  totalChaptersRead: number;
  completedDays: number[];
  lastReadDate: string | null;
  badges: string[];
}

export type AppTab = 'dashboard' | 'plan' | 'reader' | 'stats' | 'ai-coach';
