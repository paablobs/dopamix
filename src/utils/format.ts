export function formatCredits(amount: number): string {
  return amount.toLocaleString('en-US');
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Resolving...';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function formatProfit(profit: number | null): string {
  if (profit === null) return '-';
  const prefix = profit > 0 ? '+' : '';
  return `${prefix}${formatCredits(profit)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
