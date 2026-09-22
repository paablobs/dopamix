import { beforeEach, describe, expect, it } from 'vitest';
import type { Bet, BetSlipItem, FictionalEvent } from '../src/types';
import { EVENT_LIVE_DURATION, getEventStatusAt } from '../src/services/eventEngine';
import { isValidBetSlipItem } from '../src/services/betEngine';
import { useBalanceStore } from '../src/stores/balanceStore';
import { useBetStore } from '../src/stores/betStore';
import { useEventStore } from '../src/stores/eventStore';

function createEvent(startTime: number): FictionalEvent {
  return {
    id: 'event-1',
    category: 'football',
    league: 'Test League',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    startTime,
    status: startTime > Date.now() ? 'upcoming' : 'live',
    odds: { home: 2, draw: 3.2, away: 4.1 },
    homeIcon: '⚽',
    awayIcon: '🏟️',
  };
}

function createSlip(event: FictionalEvent, odds = event.odds.home): BetSlipItem {
  return {
    eventId: event.id,
    eventSummary: `${event.homeTeam} vs ${event.awayTeam}`,
    selection: 'home',
    odds,
    eventOdds: event.odds,
    homeIcon: event.homeIcon,
    awayIcon: event.awayIcon,
  };
}

function createActiveBet(event: FictionalEvent): Bet {
  return {
    id: 'bet-1',
    eventId: event.id,
    eventSummary: `${event.homeTeam} vs ${event.awayTeam}`,
    selection: 'home',
    odds: event.odds.home,
    eventOdds: event.odds,
    stake: 10,
    potentialWin: 20,
    status: 'active',
    placedAt: Date.now() - 1000,
    resolvedAt: null,
    resolutionDelay: 0,
    profit: null,
  };
}

beforeEach(() => {
  useBetStore.setState({ betSlip: [], activeBets: [], betHistory: [] });
  useBalanceStore.setState({ balance: 100, transactions: [] });
  useEventStore.setState({ events: [], lastGeneratedAt: 0 });
});

describe('event lifecycle', () => {
  it('does not resolve an active bet before the event starts', () => {
    const event = createEvent(Date.now() + 60_000);
    useEventStore.setState({ events: [event] });
    useBetStore.setState({ activeBets: [createActiveBet(event)] });

    useBetStore.getState().tickBets();

    expect(useBetStore.getState().activeBets).toHaveLength(1);
    expect(getEventStatusAt(event, event.startTime - 1)).toBe('upcoming');
    expect(getEventStatusAt(event, event.startTime + EVENT_LIVE_DURATION)).toBe('finished');
  });
});

describe('persisted bet slip validation', () => {
  it('rejects stale odds before deducting credits', () => {
    const event = createEvent(Date.now() + 60_000);
    const staleSlip = createSlip(event, 9.99);
    useEventStore.setState({ events: [event] });
    useBetStore.setState({ betSlip: [staleSlip] });

    expect(isValidBetSlipItem(staleSlip, event)).toBe(false);
    expect(useBetStore.getState().placeBet(10)).toBe(false);
    expect(useBalanceStore.getState().balance).toBe(100);
    expect(useBetStore.getState().activeBets).toHaveLength(0);
  });

  it('rejects a selection that is unavailable on the current event', () => {
    const event = createEvent(Date.now() + 60_000);
    const invalidSlip = {
      ...createSlip(event),
      selection: 'draw' as const,
      odds: event.odds.home,
    };

    expect(isValidBetSlipItem(invalidSlip, { ...event, odds: { ...event.odds, draw: null } })).toBe(false);
  });

  it('rejects nonpositive current odds', () => {
    const event = createEvent(Date.now() + 60_000);
    const invalidEvent = { ...event, odds: { home: 0, draw: 3.2, away: 4.1 } };

    expect(isValidBetSlipItem(createSlip(event), invalidEvent)).toBe(false);
  });

  it('rejects malformed persisted slip data without charging the balance', () => {
    useBetStore.setState({ betSlip: [null as unknown as BetSlipItem] });

    expect(useBetStore.getState().placeBet(10)).toBe(false);
    expect(useBalanceStore.getState().balance).toBe(100);
  });
});

describe('orphaned active bets', () => {
  it('refunds the stake and records a terminal result when the event is gone', () => {
    const event = createEvent(Date.now() - 60_000);
    useBalanceStore.setState({ balance: 25 });
    useBetStore.setState({ activeBets: [createActiveBet(event)] });
    useEventStore.setState({ events: [] });

    useBetStore.getState().tickBets();

    expect(useBalanceStore.getState().balance).toBe(35);
    expect(useBetStore.getState().activeBets).toHaveLength(0);
    expect(useBetStore.getState().betHistory[0]).toMatchObject({
      id: 'bet-1',
      status: 'refunded',
      profit: 0,
    });
  });
});
