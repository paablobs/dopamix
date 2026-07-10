import type { UserProgress } from './reward';

export interface UserProfile {
  displayName: string;
  avatar: string;
  createdAt: number;
  progress: UserProgress;
}
