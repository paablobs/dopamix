export const DAILY_COOLDOWN = 86400000;
export const MYSTERY_BOX_INTERVAL = 5;
export const STORAGE_PREFIX = 'dopamix';
export const STORAGE_VERSION = 1;
export const MAX_BET_HISTORY = 500;
export const MAX_TRANSACTIONS = 200;

export const XP_PER_LEVEL_BASE = 100;
export const XP_LEVEL_EXPONENT = 1.5;

export const SPIN_SEGMENTS = [
  { label: '50', amount: 50, weight: 40 },
  { label: '100', amount: 100, weight: 25 },
  { label: '250', amount: 250, weight: 15 },
  { label: '500', amount: 500, weight: 10 },
  { label: '1000', amount: 1000, weight: 5 },
  { label: '2x', amount: 0, multiplier: 2, weight: 5 },
];

export const AVATARS = [
  { id: 'tiger', emoji: '🐯', name: 'Tiger', unlockLevel: 1 },
  { id: 'wolf', emoji: '🐺', name: 'Wolf', unlockLevel: 1 },
  { id: 'eagle', emoji: '🦅', name: 'Eagle', unlockLevel: 3 },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', unlockLevel: 5 },
  { id: 'phoenix', emoji: '🔥', name: 'Phoenix', unlockLevel: 7 },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', unlockLevel: 10 },
  { id: 'lion', emoji: '🦁', name: 'Lion', unlockLevel: 1 },
  { id: 'bear', emoji: '🐻', name: 'Bear', unlockLevel: 3 },
  { id: 'fox', emoji: '🦊', name: 'Fox', unlockLevel: 5 },
  { id: 'owl', emoji: '🦉', name: 'Owl', unlockLevel: 7 },
  { id: 'robot', emoji: '🤖', name: 'Robot', unlockLevel: 10 },
  { id: 'alien', emoji: '👽', name: 'Alien', unlockLevel: 15 },
];

export const THEMES = [
  { id: 'dark', name: 'Dark', unlockLevel: 1 },
  { id: 'midnight', name: 'Midnight Blue', unlockLevel: 5 },
  { id: 'neon', name: 'Neon Purple', unlockLevel: 10 },
];
