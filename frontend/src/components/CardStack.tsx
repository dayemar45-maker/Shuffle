import React, { useState } from "react";
import "./CardStack.css";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  language?: string;
};

export default function CardStack({
  cards,
  onSave,
  onDelete,
}: {
  cards: Flashcard[];
  onSave?: (card: Flashcard) => void;
  onDelete?: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return <div className="cc-empty">No cards — upload or generate some!</div>;
  }

  const card = cards[index];

  function next() {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, i + 1));
  }
  function prev() {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  }
  function toggleFlip() {
    setFlipped((f) => !f);
  }

  return (
    <div className="cc-card-stack">
      <div className="cc-header">
        <div className="cc-lang">English</div>
        <div className="cc-pos">{index + 1}/{cards.length}</div>
      </div>

      <div className="cc-stack-area" role="region" aria-label="Flashcards">
        {cards.slice(index, index + 3).map((c, i) => {
          const position = i;
          const style: React.CSSProperties = {
            transform: `translateY(${position * 10}px) rotate(${position * 2}deg)`,
            zIndex: cards.length - i,
            opacity: 1 - position * 0.15,
          };
          const isTop = i === 0;
          return (
            <div
              key={c.id}
              className={`cc-card ${isTop && flipped ? "flipped" : ""}`}
              style={style}
              onClick={isTop ? toggleFlip : undefined}
              tabIndex={isTop ? 0 : -1}
              aria-hidden={!isTop}
            >
              <div className="cc-card-face cc-front">
                <div className="cc-card-content">{c.front}</div>
              </div>
              <div className="cc-card-face cc-back">
                <div className="cc-card-content">{c.back}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cc-controls">
        <button onClick={prev} disabled={index === 0}>Prev</button>
        <button onClick={() => onSave && onSave(card)}>Save</button>
        <button onClick={() => onDelete && onDelete(card.id)}>Delete</button>
        <button onClick={next} disabled={index === cards.length - 1}>Next</button>
      </div>
    </div>
  );
}
