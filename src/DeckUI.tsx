import React, { useState } from 'react';
import { Card } from './scheduler';

interface DeckUIProps {
  cards: Card[];
  onReview: (card: Card, quality: 0 | 1 | 2 | 3) => void;
}

export function DeckUI({ cards, onReview }: DeckUIProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) {
    return <div className="deck-empty">No cards due today. Come back later!</div>;
  }

  const current = cards[index];

  function handleFlip() {
    setFlipped((f) => !f);
  }

  function handleRate(quality: 0 | 1 | 2 | 3) {
    onReview(current, quality);
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  }

  return (
    <div className="deck-container">
      <p className="deck-progress">
        {index + 1} / {cards.length}
      </p>

      {/* Card with flip animation */}
      <div
        className={`card-scene ${flipped ? 'is-flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="card-body">
          <div className="card-face card-front">
            <p>{current.front}</p>
          </div>
          <div className="card-face card-back">
            <p>{current.back}</p>
          </div>
        </div>
      </div>

      <p className="flip-hint">{flipped ? 'Rate your recall:' : 'Click card to reveal answer'}</p>

      {flipped && (
        <div className="rating-buttons">
          <button onClick={() => handleRate(0)}>Forgot (0)</button>
          <button onClick={() => handleRate(1)}>Hard (1)</button>
          <button onClick={() => handleRate(2)}>Good (2)</button>
          <button onClick={() => handleRate(3)}>Easy (3)</button>
        </div>
      )}
    </div>
  );
}

/* ---- CSS-in-JS styles (drop into a .css file if preferred) ----
.deck-container { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem; }
.card-scene { width: 340px; height: 200px; perspective: 800px; cursor: pointer; }
.card-body { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.5s ease; }
.card-scene.is-flipped .card-body { transform: rotateY(180deg); }
.card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; font-size: 1.2rem; padding: 1rem; box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
.card-front { background: #ffffff; }
.card-back { background: #f0f4ff; transform: rotateY(180deg); }
.rating-buttons { display: flex; gap: 0.5rem; }
.rating-buttons button { padding: 0.4rem 0.9rem; border-radius: 8px; cursor: pointer; }
*/
