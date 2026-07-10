import { SPIN_SEGMENTS, XP_PER_LEVEL_BASE, XP_LEVEL_EXPONENT } from '../constants/rewards';
import { STREAK_BONUSES } from '../constants/balance';
import { weightedRandom, randomInt } from '../utils/random';
import type { SpinResult, Achievement, UserProgress } from '../types';

export function calculateDailyBonus(streak: number): number {
  const index = Math.min(streak, STREAK_BONUSES.length) - 1;
  return STREAK_BONUSES[Math.max(0, index)];
}

export function calculateLevelXp(level: number): number {
  return Math.round(XP_PER_LEVEL_BASE * Math.pow(level, XP_LEVEL_EXPONENT));
}

export function generateSpinResult(): SpinResult {
  const items = SPIN_SEGMENTS.map((s) => ({
    weight: s.weight,
    value: { amount: s.amount, label: s.label, multiplier: s.multiplier },
  }));
  return weightedRandom(items);
}

export function generateMysteryBoxReward(): { type: 'credits' | 'xp'; amount: number } {
  const isCredits = Math.random() > 0.3;
  if (isCredits) {
    return { type: 'credits', amount: randomInt(50, 500) };
  }
  return { type: 'xp', amount: randomInt(20, 100) };
}

export function checkAchievements(
  achievements: Achievement[],
  progress: UserProgress,
  balance: number
): Achievement[] {
  return achievements.filter((a) => {
    if (a.unlockedAt !== null) return false;
    switch (a.requirement.type) {
      case 'bets_placed':
        return progress.totalBetsPlaced >= a.requirement.value;
      case 'bets_won':
        return progress.totalBetsWon >= a.requirement.value;
      case 'streak_days':
        return progress.currentStreak >= a.requirement.value;
      case 'total_won':
        return progress.totalWon >= a.requirement.value;
      case 'level':
        return progress.level >= a.requirement.value;
      case 'balance':
        return balance >= a.requirement.value;
      default:
        return false;
    }
  });
}
