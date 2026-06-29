import { Card } from './scheduler';

let cardStore: Card[] = [];

// Generate a simple unique ID
function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Create a new card and add it to the store
export function createCard(front: string, back: string): Card {
  const today = new Date().toISOString().slice(0, 10);
  const card: Card = {
    id: generateId(),
    front,
    back,
    interval: 1,
    ease: 2.5,
    due: today,
  };
  cardStore.push(card);
  return card;
}

// Return all cards
export function getAllCards(): Card[] {
  return cardStore;
}

// Return cards that are due today or earlier
export function getDueCards(): Card[] {
  const today = new Date().toISOString().slice(0, 10);
  return cardStore.filter((card) => card.due <= today);
}

// Find a card by ID
export function getCardById(id: string): Card | undefined {
  return cardStore.find((card) => card.id === id);
}

// Update a card in the store (e.g., after a review)
export function updateCard(updated: Card): void {
  const index = cardStore.findIndex((card) => card.id === updated.id);
  if (index !== -1) {
    cardStore[index] = updated;
  }
}

// Delete a card by ID
export function deleteCard(id: string): void {
  cardStore = cardStore.filter((card) => card.id !== id);
}

// Seed the store with an initial set of cards (useful for dev/testing)
export function seedCards(cards: Card[]): void {
  cardStore = [...cards];
}
