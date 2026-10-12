export type TestDuration = 15 | 30 | 60 | 120 | 'practice';

export type PracticeCategory = 'common' | 'sentences' | 'punctuation' | 'code' | 'beginner' | 'daily';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ThemeName = 'cyber' | 'stealth' | 'emerald' | 'amber' | 'light';

export type FontChoice = 'jetbrains' | 'space' | 'mono';

export type FontSizeChoice = 'compact' | 'normal' | 'large' | 'xlarge';

export interface WpmPoint {
  second: number;
  wpm: number;
  accuracy: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  dateStr: string;
  duration: number; // seconds
  mode: TestDuration;
  category: PracticeCategory;
  difficulty: Difficulty;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  uncorrectedErrors: number;
  nickname: string;
  wpmTimeline: WpmPoint[];
  isPersonalBest?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'milestone' | 'special';
  unlockedAt: number | null;
  progress?: number;
  maxProgress?: number;
}

export interface UserSettings {
  theme: ThemeName;
  fontChoice: FontChoice;
  fontSize: FontSizeChoice;
  soundEnabled: boolean;
  soundType: 'click' | 'typewriter' | 'blip';
  soundVolume: number;
  strictMode: boolean; // Backspace disabled
  showKeyboard: boolean;
  reducedMotion: boolean;
  defaultDuration: TestDuration;
  defaultCategory: PracticeCategory;
  defaultDifficulty: Difficulty;
  nickname: string;
}

export type ActiveTab = 'test' | 'practice' | 'leaderboard' | 'dashboard' | 'achievements' | 'tips' | 'settings';
