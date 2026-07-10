import { createToaster } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
});

export function notifyBetWon(amount: number): void {
  toaster.create({
    title: 'You won!',
    description: `+${amount.toLocaleString()} credits`,
    type: 'success',
    duration: 4000,
  });
}

export function notifyBetLost(): void {
  toaster.create({
    title: 'You lost',
    description: 'Better luck next time',
    type: 'error',
    duration: 3000,
  });
}

export function notifyAchievement(name: string): void {
  toaster.create({
    title: 'Achievement unlocked!',
    description: name,
    type: 'info',
    duration: 5000,
  });
}

export function notifyDailyReward(amount: number): void {
  toaster.create({
    title: 'Daily reward!',
    description: `+${amount.toLocaleString()} credits`,
    type: 'success',
    duration: 4000,
  });
}

export function notifyLevelUp(level: number): void {
  toaster.create({
    title: 'Level up!',
    description: `Level ${level}`,
    type: 'info',
    duration: 5000,
  });
}

export function notifyCreditsAdded(amount: number, reason: string): void {
  toaster.create({
    title: reason,
    description: `+${amount.toLocaleString()} credits`,
    type: 'success',
    duration: 3000,
  });
}
