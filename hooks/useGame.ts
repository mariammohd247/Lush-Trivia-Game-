'use client';
import { useState, useCallback, useRef } from 'react';
import { QUESTIONS, CATEGORY_INFO } from '@/data/questions';
import type { Screen, CategoryKey, Question, Score } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getScores(): Score[] {
  try {
    return JSON.parse(localStorage.getItem('lushTriviaScores') || '[]');
  } catch {
    return [];
  }
}

function saveScore(name: string, score: number, category: CategoryKey) {
  const scores = getScores();
  scores.push({
    name,
    score,
    category,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('lushTriviaScores', JSON.stringify(scores.slice(0, 20)));
}

export function useGame() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [paused, setPaused] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(0);

  // Track score in a ref so nextQuestion can read the latest value synchronously
  const scoreRef = useRef(0);
  const playerNameRef = useRef('');
  const categoryRef = useRef<CategoryKey | null>(null);
  const questionsLengthRef = useRef(0);

  const startGame = useCallback((cat: CategoryKey) => {
    let pool: Question[];
    if (cat === 'bath-shower') {
      pool = [...QUESTIONS.bath, ...QUESTIONS.shower];
    } else if (cat === 'hair-body') {
      pool = [...QUESTIONS.haircare, ...QUESTIONS.bodycare];
    } else {
      pool = [...QUESTIONS[cat]];
    }
    const picked = shuffle(pool).slice(0, 10);
    categoryRef.current = cat;
    questionsLengthRef.current = picked.length;
    scoreRef.current = 0;
    setCategory(cat);
    setQuestions(picked);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setIsCorrect(null);
    setScreen('question');
  }, []);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    const q = questions[currentIndex];
    const correct = !!q.answers[idx].correct;
    setAnswered(true);
    setSelectedIndex(idx);
    setIsCorrect(correct);
    if (correct) {
      const newScore = scoreRef.current + 100;
      scoreRef.current = newScore;
      setScore(newScore);
      setTriggerConfetti(c => c + 1);
    } else {
      setShowWrongEffect(true);
      setTimeout(() => setShowWrongEffect(false), 700);
    }
  }, [answered, questions, currentIndex]);

  const nextQuestion = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= questionsLengthRef.current) {
      // Save score using ref value (synchronously accurate)
      const finalScore = scoreRef.current;
      const name = playerNameRef.current;
      const cat = categoryRef.current;
      if (cat) {
        saveScore(name, finalScore, cat);
      }
      setScreen('results');
    } else {
      setCurrentIndex(next);
      setAnswered(false);
      setSelectedIndex(null);
      setIsCorrect(null);
    }
  }, [currentIndex]);

  // Keep playerNameRef in sync
  const setPlayerNameWrapped = useCallback((name: string) => {
    playerNameRef.current = name;
    setPlayerName(name);
  }, []);

  return {
    screen, setScreen,
    playerName, setPlayerName: setPlayerNameWrapped,
    category,
    questions,
    currentIndex,
    score,
    answered,
    selectedIndex,
    isCorrect,
    paused, setPaused,
    confirmQuit, setConfirmQuit,
    showWrongEffect,
    triggerConfetti,
    startGame,
    handleAnswer,
    nextQuestion,
  };
}
