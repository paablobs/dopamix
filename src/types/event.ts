export type EventCategory = 'football' | 'basketball' | 'tennis' | 'esports' | 'racing';

export type EventStatus = 'upcoming' | 'live' | 'finished';

export interface EventOdds {
  home: number;
  draw: number | null;
  away: number;
}

export interface FictionalEvent {
  id: string;
  category: EventCategory;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: number;
  status: EventStatus;
  odds: EventOdds;
  homeIcon: string;
  awayIcon: string;
}
