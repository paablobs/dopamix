import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement, Reward, UserProgress, SpinResult } from '../types';
import { generateId } from '../utils/id';
import { calculateLevelXp, generateSpinResult, generateMysteryBoxReward, checkAchievements } from '../services/rewardEngine';
import { AVATARS, THEMES, DAILY_COOLDOWN } from '../constants/rewards';
import { notifyAchievement, notifyLevelUp, notifyCreditsAdded } from '../services/notificationService';
import { useBalanceStore } from './balanceStore';

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalBetsPlaced: 0,
  totalBetsWon: 0,
  totalBetsLost: 0,
  totalWagered: 0,
  totalWon: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastLoginDate: '',
  loginHistory: [],
  selectedAvatar: 'tiger',
  selectedTheme: 'dark',
  unlockedAvatars: ['tiger', 'wolf', 'lion'],
  unlockedThemes: ['dark'],
};

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'id' | 'unlockedAt'>[] = [
  { key: 'first_bet', name: 'First Steps', description: 'Place your first bet', icon: '🎯', requirement: { type: 'bets_placed', value: 1 } },
  { key: 'ten_bets', name: 'Novice Bettor', description: 'Place 10 bets', icon: '🎲', requirement: { type: 'bets_placed', value: 10 } },
  { key: 'fifty_bets', name: 'Veteran', description: 'Place 50 bets', icon: '🏆', requirement: { type: 'bets_placed', value: 50 } },
  { key: 'hundred_bets', name: 'Centurion', description: 'Place 100 bets', icon: '👑', requirement: { type: 'bets_placed', value: 100 } },
  { key: 'first_win', name: 'First Victory', description: 'Win your first bet', icon: '⭐', requirement: { type: 'bets_won', value: 1 } },
  { key: 'seven_wins', name: 'Lucky Seven', description: 'Win 7 bets', icon: '🍀', requirement: { type: 'bets_won', value: 7 } },
  { key: 'twenty_wins', name: 'Consistent Winner', description: 'Win 20 bets', icon: '💪', requirement: { type: 'bets_won', value: 20 } },
  { key: 'fifty_wins', name: 'Master', description: 'Win 50 bets', icon: '🔥', requirement: { type: 'bets_won', value: 50 } },
  { key: 'streak_3', name: 'Streak of 3', description: '3 consecutive days', icon: '📅', requirement: { type: 'streak_days', value: 3 } },
  { key: 'streak_7', name: 'Streak of 7', description: '7 consecutive days', icon: '🗓️', requirement: { type: 'streak_days', value: 7 } },
  { key: 'level_5', name: 'Level 5', description: 'Reach level 5', icon: '📈', requirement: { type: 'level', value: 5 } },
  { key: 'level_10', name: 'Level 10', description: 'Reach level 10', icon: '🚀', requirement: { type: 'level', value: 10 } },
  { key: 'balance_5000', name: 'Rich', description: 'Reach 5,000 credits', icon: '💰', requirement: { type: 'balance', value: 5000 } },
  { key: 'balance_10000', name: 'Millionaire', description: 'Reach 10,000 credits', icon: '💎', requirement: { type: 'balance', value: 10000 } },
  { key: 'total_won_5000', name: 'High Earnings', description: 'Win a total of 5,000', icon: '🎖️', requirement: { type: 'total_won', value: 5000 } },
];

const ACHIEVEMENTS_VERSION = 2;

function buildDefaultAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((a) => ({
    ...a,
    id: generateId(),
    unlockedAt: null,
  }));
}

function migrateAchievements(persisted: Achievement[]): Achievement[] {
  const defaults = buildDefaultAchievements();
  return defaults.map((def) => {
    const existing = persisted.find((p) => p.key === def.key);
    if (existing) {
      return { ...def, id: existing.id, unlockedAt: existing.unlockedAt };
    }
    return def;
  });
}

interface RewardState {
  profile: { displayName: string; avatar: string; createdAt: number; progress: UserProgress };
  achievements: Achievement[];
  rewards: Reward[];
  lastDailyClaim: number | null;
  lastSpinClaim: number | null;
  mysteryBoxCount: number;
  activeMultiplier: number;

  addXp: (amount: number) => void;
  updateStreak: () => void;
  checkAndUnlockAchievements: () => void;
  claimDailyReward: () => number | null;
  spinWheel: () => SpinResult | null;
  openMysteryBox: () => { type: 'credits' | 'xp'; amount: number } | null;
  selectAvatar: (id: string) => void;
  selectTheme: (id: string) => void;
  incrementBetCount: () => void;
  recordWin: (amount: number) => void;
  recordLoss: () => void;
}

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      profile: {
        displayName: 'Player',
        avatar: 'tiger',
        createdAt: Date.now(),
        progress: { ...DEFAULT_PROGRESS },
      },
      achievements: buildDefaultAchievements(),
      rewards: [],
      lastDailyClaim: null,
      lastSpinClaim: null,
      mysteryBoxCount: 0,
      activeMultiplier: 1,

      addXp: (amount) => {
        set((state) => {
          const progress = { ...state.profile.progress };
          progress.xp += amount;

          while (progress.xp >= progress.xpToNext) {
            progress.xp -= progress.xpToNext;
            progress.level += 1;
            progress.xpToNext = calculateLevelXp(progress.level);
            notifyLevelUp(progress.level);

            const newAvatar = AVATARS.find((a) => a.unlockLevel === progress.level);
            if (newAvatar && !progress.unlockedAvatars.includes(newAvatar.id)) {
              progress.unlockedAvatars = [...progress.unlockedAvatars, newAvatar.id];
            }
            const newTheme = THEMES.find((t) => t.unlockLevel === progress.level);
            if (newTheme && !progress.unlockedThemes.includes(newTheme.id)) {
              progress.unlockedThemes = [...progress.unlockedThemes, newTheme.id];
            }
          }

          return {
            profile: { ...state.profile, progress },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const progress = { ...state.profile.progress };
          const today = new Date().toISOString().split('T')[0];

          if (progress.lastLoginDate === today) return state;

          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          if (progress.lastLoginDate === yesterday) {
            progress.currentStreak += 1;
          } else {
            progress.currentStreak = 1;
          }

          progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
          progress.lastLoginDate = today;
          progress.loginHistory = [...progress.loginHistory.slice(-30), today];

          return { profile: { ...state.profile, progress } };
        });
      },

      checkAndUnlockAchievements: () => {
        const state = get();
        const balance = useBalanceStore.getState().balance;
        const newlyUnlocked = checkAchievements(state.achievements, state.profile.progress, balance);

        if (newlyUnlocked.length > 0) {
          const now = Date.now();
          set((s) => ({
            achievements: s.achievements.map((a) => {
              const match = newlyUnlocked.find((u) => u.id === a.id);
              return match ? { ...a, unlockedAt: now } : a;
            }),
          }));
          newlyUnlocked.forEach((a) => notifyAchievement(a.name));
        }
      },

      claimDailyReward: () => {
        const { lastDailyClaim } = get();
        const now = Date.now();
        if (lastDailyClaim && now - lastDailyClaim < DAILY_COOLDOWN) return null;

        const { profile } = get();
        const streak = profile.progress.currentStreak;
        const bonusIndex = Math.min(streak, 7) - 1;
        const amount = [100, 200, 300, 400, 500, 750, 1000][Math.max(0, bonusIndex)];

        set({ lastDailyClaim: now });
        useBalanceStore.getState().addCredits(amount, `Daily bonus (streak ${streak})`);
        notifyCreditsAdded(amount, 'Daily reward');
        return amount;
      },

      spinWheel: () => {
        const { lastSpinClaim } = get();
        const now = Date.now();
        if (lastSpinClaim && now - lastSpinClaim < DAILY_COOLDOWN) return null;

        const result = generateSpinResult();
        set({ lastSpinClaim: now });

        if (result.amount > 0) {
          const finalAmount = result.multiplier ? result.amount : result.amount;
          useBalanceStore.getState().addCredits(finalAmount, 'Lucky spin');
          notifyCreditsAdded(finalAmount, 'Lucky spin!');
        } else if (result.multiplier) {
          set({ activeMultiplier: result.multiplier });
        }

        return result;
      },

      openMysteryBox: () => {
        const result = generateMysteryBoxReward();
        if (result.type === 'credits') {
          useBalanceStore.getState().addCredits(result.amount, 'Mystery box');
          notifyCreditsAdded(result.amount, 'Mystery box!');
        } else {
          get().addXp(result.amount);
        }
        set({ mysteryBoxCount: 0 });
        return result;
      },

      selectAvatar: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            avatar: id,
            progress: { ...state.profile.progress, selectedAvatar: id },
          },
        }));
      },

      selectTheme: (id) => {
        set((state) => ({
          profile: {
            ...state.profile,
            progress: { ...state.profile.progress, selectedTheme: id },
          },
        }));
      },

      incrementBetCount: () => {
        set((state) => {
          const progress = { ...state.profile.progress };
          progress.totalBetsPlaced += 1;
          return {
            profile: { ...state.profile, progress },
            mysteryBoxCount: state.mysteryBoxCount + 1,
          };
        });
        get().checkAndUnlockAchievements();
      },

      recordWin: (amount) => {
        set((state) => {
          const progress = { ...state.profile.progress };
          progress.totalBetsWon += 1;
          progress.totalWon += amount;
          return { profile: { ...state.profile, progress } };
        });
        get().checkAndUnlockAchievements();
      },

      recordLoss: () => {
        set((state) => {
          const progress = { ...state.profile.progress };
          progress.totalBetsLost += 1;
          return { profile: { ...state.profile, progress } };
        });
      },
    }),
    {
      name: 'dopamix_rewards',
      version: ACHIEVEMENTS_VERSION,
      migrate: (persisted: unknown, version: number) => {
        if (version < ACHIEVEMENTS_VERSION) {
          const state = persisted as Partial<RewardState>;
          return {
            ...state,
            achievements: migrateAchievements(state.achievements ?? []),
          };
        }
        return persisted;
      },
    }
  )
);
