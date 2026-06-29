import { Card } from './scheduler';
import { getAllCards } from './cards';

// TODO: wire up to real session tracking
// WIP: retention rate and streak tracking not yet implemented

export interface Stats {
  totalCards: number;
  dueToday: number;
  masteredCards: number;   // interval >= 21 days
  averageEase: number;
  reviewsToday: number;    // TODO: track per-session
  streakDays: number;      // TODO: persist to localStorage
}

export function computeStats(): Stats {
  const cards = getAllCards();
  const today = new Date().toISOString().slice(0, 10);

  const dueToday = cards.filter((c) => c.due <= today).length;
  const masteredCards = cards.filter((c) => c.interval >= 21).length;
  const averageEase =
    cards.length === 0
      ? 0
      : cards.reduce((sum, c) => sum + c.ease, 0) / cards.length;

  return {
    totalCards: cards.length,
    dueToday,
    masteredCards,
    averageEase: Math.round(averageEase * 100) / 100,
    reviewsToday: 0,   // TODO
    streakDays: 0,     // TODO
  };
}

// TODO: StatsDashboard React component coming in next commit
// Planned widgets:
//   - Cards due today (badge)
//   - Mastered cards progress bar
//   - Average ease gauge
//   - 7-day review heatmap
//   - Streak counter
