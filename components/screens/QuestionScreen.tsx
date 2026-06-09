'use client';
import { CATEGORY_INFO } from '@/data/questions';
import type { Question, CategoryKey } from '@/types';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  category: CategoryKey;
  answered: boolean;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  showWrongEffect: boolean;
  onAnswer: (idx: number) => void;
  onNext: () => void;
  onBack: () => void;
  onPause: () => void;
}

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  score,
  category,
  answered,
  selectedIndex,
  isCorrect,
  showWrongEffect,
  onAnswer,
  onNext,
  onBack,
  onPause,
}: QuestionScreenProps) {
  const catInfo = CATEGORY_INFO[category];
  const progressPct = (questionNumber / totalQuestions) * 100;

  function getAnswerClass(idx: number): string {
    if (!answered) return '';
    if (question.answers[idx].correct) return 'correct';
    if (idx === selectedIndex && !question.answers[idx].correct) return 'wrong';
    return '';
  }

  return (
    <div className="question-layout">
      {/* Header */}
      <div className="question-header">
        <button className="q-icon-btn" onClick={onBack} title="Back to categories">
          ←
        </button>
        <span
          className="q-category-label"
          style={{ background: catInfo.gradient }}
        >
          {catInfo.name}
        </span>
        <span className="q-number">
          {questionNumber} / {totalQuestions}
        </span>
        <span className="q-score">⭐ {score}</span>
        <button className="q-icon-btn" onClick={onPause} title="Pause">
          ⏸
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPct}%`, background: catInfo.gradient }}
        />
      </div>

      {/* Question card */}
      <div className="question-card">
        <p id="question-text">{question.question}</p>

        {question.type === 'product' && question.productImage && (
          <div className="product-card">
            <img
              src={question.productImage}
              alt="Product"
              className="product-photo"
            />
            {question.productDetail && (
              <p className="product-detail-text">{question.productDetail}</p>
            )}
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="answers-grid">
        {question.answers.map((answer, idx) => (
          <button
            key={idx}
            className={`answer-btn ${getAnswerClass(idx)}`}
            disabled={answered}
            onClick={() => onAnswer(idx)}
          >
            <span className="answer-label">{answer.label}</span>
            <span className="answer-text">{answer.text}</span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div id="explanation">
          {question.explanation}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button id="next-btn" onClick={onNext}>
          {questionNumber >= totalQuestions ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
