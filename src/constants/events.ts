import type { EventCategory } from '../types';

export const EVENTS_PER_PAGE = 12;
export const EVENT_REFRESH_INTERVAL = 300000;
export const MAX_ACTIVE_EVENTS = 50;

export const CATEGORIES: EventCategory[] = [
  'football',
  'basketball',
  'tennis',
  'esports',
  'racing',
];

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  football: 'Football',
  basketball: 'Basketball',
  tennis: 'Tennis',
  esports: 'E-Sports',
  racing: 'Racing',
};

export const CATEGORY_ICONS: Record<EventCategory, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  esports: '🎮',
  racing: '🏎️',
};

export const TEAM_ADJECTIVES = [
  'Red', 'Blue', 'Neon', 'Shadow', 'Golden', 'Cyber', 'Storm', 'Iron',
  'Electric', 'Phantom', 'Crimson', 'Silver', 'Dark', 'Frozen', 'Blazing',
  'Cosmic', 'Thunder', 'Midnight', 'Royal', 'Savage',
];

export const TEAM_NOUNS = [
  'Tigers', 'Wolves', 'Eagles', 'Sharks', 'Knights', 'Riders', 'Hawks',
  'Dragons', 'Panthers', 'Vipers', 'Bears', 'Lions', 'Falcons', 'Cobras',
  'Phoenix', 'Wizards', 'Titans', 'Raiders', 'Warriors', 'Rebels',
];

export const LEAGUE_NAMES = [
  'Phantom League', 'Neon Cup', 'Shadow Championship', 'Crystal Division',
  'Quantum League', 'Hyper Cup', 'Nova Series', 'Eclipse Championship',
  'Infinity League', 'Zenith Cup', 'Apex Division', 'Prime League',
];

export const SPORT_ICONS: Record<EventCategory, string[]> = {
  football: ['⚽', '🏟️', '🥅'],
  basketball: ['🏀', '🏟️', '💪'],
  tennis: ['🎾', '🏟️', '🏆'],
  esports: ['🎮', '🖥️', '🎯'],
  racing: ['🏎️', '🏁', '🛣️'],
};
