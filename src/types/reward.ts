export type RewardType =
  | 'daily_bonus'
  | 'streak_bonus'
  | 'achievement'
  | 'mystery_box'
  | 'lucky_spin'
  | 'level_up'
  | 'welcome'
  | 'free_refill';

export interface Reward {
  id: string;
  type: RewardType;
  amount: number;
  claimedAt: number;
  description: string;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  requirement: {
    type: 'bets_placed' | 'bets_won' | 'streak_days' | 'total_won' | 'level' | 'balance';
    value: number;
  };
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNext: number;
  totalBetsPlaced: number;
  totalBetsWon: number;
  totalBetsLost: number;
  totalWagered: number;
  totalWon: number;
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  loginHistory: string[];
  selectedAvatar: string;
  selectedTheme: string;
  unlockedAvatars: string[];
  unlockedThemes: string[];
}

export interface SpinResult {
  amount: number;
  label: string;
  multiplier?: number;
}
