'use client';
import { useEffect, useState } from 'react';
import { CATEGORY_INFO } from '@/data/questions';
import type { CategoryKey, Score } from '@/types';

interface ResultsScreenProps {
  playerName: string;
  score: number;
  totalQuestions: number;
  category: CategoryKey;
  onPlayAgain: () => void;
  onChangeCategory: () => void;
}

function getMessage(pct: number): string {
  if (pct === 100) return '🌟 Perfect score! You\'re a Lush genius!';
  if (pct >= 80) return '🎉 Amazing! You really know your Lush!';
  if (pct >= 60) return '👏 Great effort! Keep exploring Lush!';
  if (pct >= 40) return '💪 Not bad! Time to visit a Lush store?';
  return '🛁 Keep learning — Lush has so much to discover!';
}

export function ResultsScreen({
  playerName,
  score,
  totalQuestions,
  category,
  onPlayAgain,
  onChangeCategory,
}: ResultsScreenProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const maxScore = totalQuestions * 100;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const catInfo = CATEGORY_INFO[category];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lushTriviaScores') || '[]') as Score[];
      setScores(saved);
    } catch {
      setScores([]);
    }
  }, []);

  return (
    <div className="results-inner">
      <h1 className="results-title">Results</h1>

      <div className="results-score-card">
        {playerName && (
          <p className="results-player">
            Player: <strong>{playerName}</strong>
          </p>
        )}
        <div className="results-big-score">{score}</div>
        <p className="results-fraction">
          {score} / {maxScore} points
        </p>
        <p className="results-percent">{pct}%</p>
        <p className="results-category">{catInfo.name}</p>
        <p className="results-message">{getMessage(pct)}</p>
      </div>

      {scores.length > 0 && (
        <div>
          <p className="leaderboard-title">🏆 Leaderboard</p>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, 10).map((s, i) => {
                const isCurrentPlayer =
                  s.name === playerName && s.score === score && s.category === category;
                return (
                  <tr key={i} className={isCurrentPlayer ? 'current-player' : ''}>
                    <td>{i + 1}</td>
                    <td>{s.name || 'Anonymous'}</td>
                    <td>{s.score}</td>
                    <td>{CATEGORY_INFO[s.category]?.name ?? s.category}</td>
                    <td>{s.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="results-actions">
        <button className="btn-primary" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="btn-secondary" onClick={onChangeCategory}>
          Change Category
        </button>
      </div>
    </div>
  );
}
