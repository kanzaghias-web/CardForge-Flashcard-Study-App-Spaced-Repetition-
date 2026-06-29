// SM-2 ease-factor constants
export const EASE_MIN = 1.3;
export const EASE_MAX = 4.0;
export const EASE_DEFAULT = 2.5;
export const EASE_DELTA = 0.1; // per quality point from neutral (2)

export interface Card {
  id: string;
  front: string;
  back: string;
  interval: number; // days
  ease: number;
  due: string; // ISO date
}

export function review(card: Card, quality: 0 | 1 | 2 | 3): Card {
  // quality: 0 = forgot, 3 = easy
  let { interval, ease } = card;

  if (quality === 0) {
    interval = 1;
  } else {
    interval = Math.round(interval * ease);
    // Apply ease adjustment and clamp within safe bounds
    ease = ease + (quality - 2) * EASE_DELTA;
    ease = Math.max(EASE_MIN, Math.min(ease, EASE_MAX));
  }

  const due = new Date();
  due.setDate(due.getDate() + interval);
  return { ...card, interval, ease, due: due.toISOString().slice(0, 10) };
}
