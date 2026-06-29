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
    ease = Math.max(1.3, ease + (quality - 2) * 0.1);
  }
  const due = new Date();
  due.setDate(due.getDate() + interval);
  return { ...card, interval, ease, due: due.toISOString().slice(0, 10) };
}
