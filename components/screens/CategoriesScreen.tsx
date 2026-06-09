'use client';
import { CATEGORY_INFO } from '@/data/questions';
import type { CategoryKey } from '@/types';

interface CategoriesScreenProps {
  onSelect: (cat: CategoryKey) => void;
}

const DOODLES = [
  { emoji: '🛁', x: '5%', y: '8%', s: '2.2rem', rot: '-15deg', del: '0s' },
  { emoji: '🫧', x: '88%', y: '5%', s: '1.8rem', rot: '10deg', del: '1.1s' },
  { emoji: '🌿', x: '92%', y: '35%', s: '2rem', rot: '20deg', del: '0.6s' },
  { emoji: '🌹', x: '3%', y: '55%', s: '1.7rem', rot: '-10deg', del: '2s' },
  { emoji: '💛', x: '8%', y: '82%', s: '1.5rem', rot: '5deg', del: '1.5s' },
  { emoji: '✦', x: '50%', y: '4%', s: '1.4rem', rot: '0deg', del: '0.3s' },
  { emoji: '🐇', x: '85%', y: '75%', s: '2rem', rot: '8deg', del: '2.4s' },
  { emoji: '🌸', x: '70%', y: '88%', s: '1.6rem', rot: '-5deg', del: '1.8s' },
  { emoji: '⭐', x: '20%', y: '90%', s: '1.5rem', rot: '12deg', del: '0.9s' },
  { emoji: '🧴', x: '78%', y: '18%', s: '1.9rem', rot: '-18deg', del: '3s' },
];

const CATEGORIES: CategoryKey[] = ['bath-shower', 'hair-body', 'fragrances', 'values'];

export function CategoriesScreen({ onSelect }: CategoriesScreenProps) {
  return (
    <>
      <div className="cat-doodle-layer">
        {DOODLES.map((d, i) => (
          <span
            key={i}
            className="cdoodle"
            style={
              {
                '--x': d.x,
                '--y': d.y,
                '--s': d.s,
                '--rot': d.rot,
                '--del': d.del,
              } as React.CSSProperties
            }
          >
            {d.emoji}
          </span>
        ))}
      </div>

      <h1 className="categories-title">Choose a Category</h1>
      <p className="categories-subtitle">10 random questions · 100 points each</p>

      <div className="categories-grid">
        {CATEGORIES.map(cat => {
          const info = CATEGORY_INFO[cat];
          const isValues = cat === 'values';
          return (
            <button
              key={cat}
              className="category-btn"
              style={{ '--cat-color': info.color } as React.CSSProperties}
              onClick={() => onSelect(cat)}
            >
              {isValues ? (
                <div className="cat-values-bg" />
              ) : (
                <>
                  <div
                    className="cat-img"
                    style={{ backgroundImage: `url(${info.image})` }}
                  />
                  <div className="cat-overlay" />
                </>
              )}
              <div className="cat-content">
                <span className="category-name">{info.name}</span>
                <span className="category-desc">{info.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
