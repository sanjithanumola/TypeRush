import { Achievement, Difficulty, PracticeCategory, TestDuration, TestResult, UserSettings } from '../types';

const SETTINGS_KEY = 'typerush_settings_v1';
const RESULTS_KEY = 'typerush_results_v1';
const ACHIEVEMENTS_KEY = 'typerush_achievements_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'cyber',
  fontChoice: 'jetbrains',
  fontSize: 'normal',
  soundEnabled: true,
  soundType: 'click',
  soundVolume: 0.6,
  strictMode: false,
  showKeyboard: true,
  reducedMotion: false,
  defaultDuration: 30,
  defaultCategory: 'common',
  defaultDifficulty: 'medium',
  nickname: 'Speedster'
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_rush',
    title: 'First Rush',
    description: 'Complete your first typing test challenge.',
    icon: '⚡',
    category: 'milestone',
    unlockedAt: null
  },
  {
    id: 'speed_40',
    title: 'Velocity 40',
    description: 'Surpass 40 WPM in any timed challenge.',
    icon: '🚀',
    category: 'speed',
    unlockedAt: null
  },
  {
    id: 'speed_60',
    title: 'Turbo 60',
    description: 'Surpass 60 WPM in any timed challenge.',
    icon: '🔥',
    category: 'speed',
    unlockedAt: null
  },
  {
    id: 'speed_80',
    title: 'Lightning 80',
    description: 'Surpass 80 WPM in any timed challenge.',
    icon: '⚡',
    category: 'speed',
    unlockedAt: null
  },
  {
    id: 'speed_100',
    title: 'Centurion 100',
    description: 'Reach a blistering 100+ WPM in a timed test.',
    icon: '👑',
    category: 'speed',
    unlockedAt: null
  },
  {
    id: 'speed_120',
    title: 'Godspeed 120',
    description: 'Ascend beyond 120+ WPM. Elite typist reflexes.',
    icon: '🌟',
    category: 'speed',
    unlockedAt: null
  },
  {
    id: 'accuracy_95',
    title: 'Sniper Precision',
    description: 'Finish a 30s+ test with 95% or higher accuracy.',
    icon: '🎯',
    category: 'accuracy',
    unlockedAt: null
  },
  {
    id: 'accuracy_98',
    title: 'Flawless Touch',
    description: 'Finish a 30s+ test with 98% or higher accuracy.',
    icon: '💎',
    category: 'accuracy',
    unlockedAt: null
  },
  {
    id: 'streak_10',
    title: 'Consistent Flow',
    description: 'Complete 10 total typing tests.',
    icon: '🏅',
    category: 'milestone',
    unlockedAt: null,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'marathon_120',
    title: 'Endurance Marathon',
    description: 'Complete a full 120-second endurance challenge.',
    icon: '⏱️',
    category: 'special',
    unlockedAt: null
  },
  {
    id: 'daily_champ',
    title: 'Daily Challenger',
    description: 'Complete today\'s synchronized Daily Challenge.',
    icon: '📅',
    category: 'special',
    unlockedAt: null
  },
  {
    id: 'strict_master',
    title: 'Strict Perfectionist',
    description: 'Complete a test with Strict Mode (no backspace) at >95% accuracy.',
    icon: '🛡️',
    category: 'accuracy',
    unlockedAt: null
  }
];

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage quota or private browsing error handled
  }
}

export function getStoredResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredResult(result: TestResult): { updatedResults: TestResult[]; isPb: boolean; newAchievements: Achievement[] } {
  try {
    const results = getStoredResults();
    
    // Check if this is a personal best for this duration
    const previousForMode = results.filter((r) => r.mode === result.mode);
    const prevBestWpm = previousForMode.length > 0 ? Math.max(...previousForMode.map((r) => r.netWpm)) : 0;
    const isPb = result.netWpm > prevBestWpm;
    
    const enrichedResult = { ...result, isPersonalBest: isPb };
    const updated = [enrichedResult, ...results];
    
    // Cap to 200 recent tests to avoid excessive storage bloat
    const capped = updated.slice(0, 200);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(capped));
    
    // Evaluate achievements
    const newAchievements = evaluateAchievements(enrichedResult, capped);
    
    return { updatedResults: capped, isPb, newAchievements };
  } catch {
    return { updatedResults: [result], isPb: false, newAchievements: [] };
  }
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const stored: Achievement[] = JSON.parse(raw);
    // Merge with any newly introduced achievements
    return INITIAL_ACHIEVEMENTS.map((initial) => {
      const found = stored.find((s) => s.id === initial.id);
      return found ? { ...initial, ...found } : initial;
    });
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveStoredAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // handled
  }
}

function evaluateAchievements(lastResult: TestResult, allResults: TestResult[]): Achievement[] {
  const currentAchievements = getStoredAchievements();
  const newlyUnlocked: Achievement[] = [];
  const now = Date.now();

  const updated = currentAchievements.map((ach) => {
    if (ach.unlockedAt) return ach; // already unlocked

    let shouldUnlock = false;

    switch (ach.id) {
      case 'first_rush':
        shouldUnlock = allResults.length >= 1;
        break;
      case 'speed_40':
        shouldUnlock = lastResult.netWpm >= 40;
        break;
      case 'speed_60':
        shouldUnlock = lastResult.netWpm >= 60;
        break;
      case 'speed_80':
        shouldUnlock = lastResult.netWpm >= 80;
        break;
      case 'speed_100':
        shouldUnlock = lastResult.netWpm >= 100;
        break;
      case 'speed_120':
        shouldUnlock = lastResult.netWpm >= 120;
        break;
      case 'accuracy_95':
        shouldUnlock = (lastResult.mode === 30 || lastResult.mode === 60 || lastResult.mode === 120) && lastResult.accuracy >= 95;
        break;
      case 'accuracy_98':
        shouldUnlock = (lastResult.mode === 30 || lastResult.mode === 60 || lastResult.mode === 120) && lastResult.accuracy >= 98;
        break;
      case 'streak_10':
        ach.progress = allResults.length;
        shouldUnlock = allResults.length >= 10;
        break;
      case 'marathon_120':
        shouldUnlock = lastResult.mode === 120;
        break;
      case 'daily_champ':
        shouldUnlock = lastResult.category === 'daily';
        break;
      case 'strict_master':
        // If accuracy > 95 with uncorrected errors = 0
        shouldUnlock = lastResult.uncorrectedErrors === 0 && lastResult.accuracy >= 95 && lastResult.totalChars >= 50;
        break;
    }

    if (shouldUnlock) {
      const unlockedItem = { ...ach, unlockedAt: now };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return ach;
  });

  if (newlyUnlocked.length > 0) {
    saveStoredAchievements(updated);
  }

  return newlyUnlocked;
}

export function getPersonalBests(results: TestResult[]): Record<string, { wpm: number; accuracy: number; dateStr: string }> {
  const pbs: Record<string, { wpm: number; accuracy: number; dateStr: string }> = {
    '15': { wpm: 0, accuracy: 0, dateStr: '—' },
    '30': { wpm: 0, accuracy: 0, dateStr: '—' },
    '60': { wpm: 0, accuracy: 0, dateStr: '—' },
    '120': { wpm: 0, accuracy: 0, dateStr: '—' },
    'practice': { wpm: 0, accuracy: 0, dateStr: '—' }
  };

  results.forEach((r) => {
    const key = String(r.mode);
    if (pbs[key] && r.netWpm > pbs[key].wpm) {
      pbs[key] = {
        wpm: r.netWpm,
        accuracy: r.accuracy,
        dateStr: r.dateStr
      };
    }
  });

  return pbs;
}

export function getLifetimeStats(results: TestResult[]) {
  if (results.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      totalTimeSeconds: 0,
      totalChars: 0
    };
  }

  const totalTests = results.length;
  const bestWpm = Math.max(...results.map((r) => r.netWpm));
  const avgWpm = Math.round(results.reduce((acc, r) => acc + r.netWpm, 0) / totalTests);
  const avgAccuracy = Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) * 10) / 10;
  const totalTimeSeconds = results.reduce((acc, r) => acc + r.duration, 0);
  const totalChars = results.reduce((acc, r) => acc + r.totalChars, 0);

  return {
    totalTests,
    bestWpm,
    avgWpm,
    avgAccuracy,
    totalTimeSeconds,
    totalChars
  };
}

export function exportDataAsJson(): string {
  const data = {
    app: 'TypeRush',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    settings: getStoredSettings(),
    results: getStoredResults(),
    achievements: getStoredAchievements()
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJson(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') return false;

    if (data.settings) {
      saveStoredSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    }
    if (Array.isArray(data.results)) {
      localStorage.setItem(RESULTS_KEY, JSON.stringify(data.results));
    }
    if (Array.isArray(data.achievements)) {
      saveStoredAchievements(data.achievements);
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAllUserData(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(RESULTS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch {
    // handled
  }
}
