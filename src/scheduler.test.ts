import { review, EASE_MIN, EASE_MAX, EASE_DEFAULT, EASE_EASY_BONUS } from './scheduler';
const baseCard = {
  id: 'test-1',
  front: 'What is 2 + 2?',
  back: '4',
  interval: 1,
  ease: EASE_DEFAULT,
  due: '2026-06-29',
};

// Helper to repeatedly apply a rating n times
function applyRating(card: typeof baseCard, quality: 0 | 1 | 2 | 3, times: number) {
  let c = card;
  for (let i = 0; i < times; i++) {
    c = review(c, quality);
  }
  return c;
}

describe('review() ease-factor clamping', () => {
  test('ease never drops below EASE_MIN after many hard ratings', () => {
    const result = applyRating(baseCard, 0, 20);
    expect(result.ease).toBeGreaterThanOrEqual(EASE_MIN);
  });

  test('ease never exceeds EASE_MAX after many easy ratings', () => {
    const result = applyRating(baseCard, 3, 30);
    expect(result.ease).toBeLessThanOrEqual(EASE_MAX);
  });

  test('ease stays at EASE_DEFAULT for neutral quality (2)', () => {
    const result = review(baseCard, 2);
    expect(result.ease).toBeCloseTo(EASE_DEFAULT);
  });

  test('forgetting a card resets interval to 1', () => {
    const card = { ...baseCard, interval: 30, ease: 2.8 };
    const result = review(card, 0);
    expect(result.interval).toBe(1);
  });

  test('interval grows after a quality-3 review', () => {
    const result = review(baseCard, 3);
    expect(result.interval).toBeGreaterThan(baseCard.interval);
  });

  test('ease clamp at lower boundary - exactly EASE_MIN', () => {
    const card = { ...baseCard, ease: EASE_MIN + 0.01 };
    const result = review(card, 0);
    // quality 0 resets interval but does not update ease
    expect(result.ease).toBeGreaterThanOrEqual(EASE_MIN);
  });

  test('easy answers grow ease gently using EASE_EASY_BONUS', () => {
    const once = review(baseCard, 3);
    expect(once.ease).toBeCloseTo(EASE_DEFAULT + EASE_EASY_BONUS);
  });

  test('easy ease growth is gentler than the full EASE_DELTA step', () => {
    const easy = review(baseCard, 3);
    expect(easy.ease - EASE_DEFAULT).toBeLessThan(0.1);
  });

  test('repeated easy answers keep ease within EASE_MAX', () => {
    const result = applyRating(baseCard, 3, 50);
    expect(result.ease).toBeLessThanOrEqual(EASE_MAX);
    expect(result.ease).toBeGreaterThan(EASE_DEFAULT);
  });
  
});
