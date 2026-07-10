export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export type SortDirection = 'asc' | 'desc';

export interface Transaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
  type: 'credit' | 'debit';
}
