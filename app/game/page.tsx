"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { generateQuestions, Question, CATEGORY_META } from "@/lib/questions";
import { loadSession, saveSession } from "@/lib/storage";
import { playClap, playGrill } from "@/lib/sounds";

type Screen = "pick" | "loading" | "question" | "feedback" | "cat-done";

interface Session {
  playerName: string;
  score: number;
  total: number;
  categories: string[];
}

const LABELS = ["a", "b", "c", "d"];

const QUESTION_TYPE_LABELS: Record<string, string> = {
  "image-name": "🍽️ Name the Dish",
  "main-ingredient": "🥘 Main Ingredient",
  "cuisine-origin": "🌍 Cuisine Origin",
  "dish-category": "📂 Food Category",
  "not-ingredient": "❓ Odd One Out",
};

const FLOATERS_GAME = ["🍅", "🫒", "🌿", "🧄", "🌶️", "🥕", "🍋", "🧅"];

export default function GamePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session>({
    playerName: "Chef",
    score: 0,
    total: 0,
    categories: [],
  });

  const [screen, setScreen] = useState<Screen>("pick");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [catScore, setCatScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession<Session>();
    if (!s) { router.replace("/"); return; }
    setSession(s);
  }, [router]);

  const pickCategory = useCallback(async (key: string) => {
    setActiveCat(key);
    setScreen("loading");
    setError(null);
    setCatScore(0);
    setQIndex(0);
    setSelected(null);
    try {
      const qs = await generateQuestions(key);
      setQuestions(qs);
      setScreen("question");
    } catch {
      setError("Couldn't load questions. Check your connection and try again.");
      setScreen("pick");
    }
  }, []);

  const handleAnswer = useCallback(
    async (idx: number) => {
      if (selected !== null || !questions[qIndex]) return;
      setSelected(idx);

      const correct = idx === questions[qIndex].correctIndex;
      const newScore = session.score + (correct ? 1 : 0);
      const newTotal = session.total + 1;
      const newCatScore = catScore + (correct ? 1 : 0);

      const updated: Session = {
        ...session,
        score: newScore,
        total: newTotal,
      };
      setSession(updated);
      saveSession(updated);

      if (correct) {
        playClap();
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.65 },
          colors: ["#F9C74F", "#90BE6D", "#0096C7", "#E85D04", "#D90429"],
          ticks: 220,
        });
      } else {
        playGrill();
      }

      setCatScore(newCatScore);

      setTimeout(() => {
        if (qIndex + 1 >= questions.length) {
          setScreen("cat-done");
        } else {
          setQIndex((i) => i + 1);
          setSelected(null);
          setScreen("question");
        }
      }, 1600);
    },
    [selected, questions, qIndex, session, catScore]
  );

  const finishGame = () => {
    const updated: Session = {
      ...session,
      categories: [...session.categories, activeCat!],
    };
    saveSession(updated);
    router.push("/results");
  };

  const playAnother = () => {
    const updated: Session = {
      ...session,
      categories: [...session.categories, activeCat!],
    };
    setSession(updated);
    saveSession(updated);
    setActiveCat(null);
    setScreen("pick");
  };

  const q = questions[qIndex] ?? null;
  const progress = questions.length > 0 ? ((qIndex + (selected !== null ? 1 : 0)) / questions.length) * 100 : 0;
  const meta = activeCat ? CATEGORY_META[activeCat] : null;

  return (
    <main className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
      {/* Background floaters */}
      {FLOATERS_GAME.map((e, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none text-3xl opacity-15"
          style={{
            left: `${(i * 13 + 5) % 90}%`,
            top: `${(i * 19 + 10) % 80}%`,
            animation: `float ${3 + (i % 3) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {e}
        </div>
      ))}

      {/* Header */}
      <header className="relative z-10 w-full max-w-2xl flex items-center justify-between py-3 mb-4">
        <button
          onClick={() => router.push("/")}
          className="doodle-btn px-3 py-1 text-lg font-semibold bg-white"
        >
          ← Home
        </button>
        <div className="doodle-card-sm px-4 py-2 text-center">
          <span className="text-lg font-bold text-ink">
            👨‍🍳 {session.playerName}
          </span>
        </div>
        <div className="doodle-card-sm px-4 py-2">
          <span className="text-lg font-bold" style={{ color: "#E85D04" }}>
            ⭐ {session.score} pts
          </span>
        </div>
      </header>

      {/* ── PICK CATEGORY ── */}
      {screen === "pick" && (
        <section className="relative z-10 w-full max-w-2xl animate-fade-up">
          <div className="doodle-card p-6 md:p-8 text-center mb-6">
            <h2 className="text-4xl font-bold text-ink mb-1">
              Pick your cuisine! 🌍
            </h2>
            <p className="text-lg text-gray-500">Choose a category to start cooking</p>
            {error && (
              <p className="mt-3 text-[#D90429] font-semibold text-lg">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(CATEGORY_META).map(([key, m]) => {
              const done = session.categories.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => !done && pickCategory(key)}
                  disabled={done}
                  className={`cat-card p-6 text-left transition-all ${
                    done ? "opacity-50 grayscale" : ""
                  }`}
                  style={{ background: m.bg }}
                >
                  <div className="text-5xl mb-3">{m.emoji}</div>
                  <h3 className="text-2xl font-bold text-ink">{m.label}</h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: m.color }}>
                    {done ? "✅ Completed!" : "5 questions →"}
                  </p>
                </button>
              );
            })}
          </div>

          {session.categories.length > 0 && (
            <button
              onClick={finishGame}
              className="doodle-btn w-full mt-6 py-4 text-xl font-bold text-white bg-[#386641]"
            >
              See My Final Score! 🏆
            </button>
          )}
        </section>
      )}

      {/* ── LOADING ── */}
      {screen === "loading" && meta && (
        <section className="relative z-10 doodle-card p-10 text-center max-w-md w-full animate-bounce-in">
          <div className="text-6xl mb-4 animate-spin">{meta.emoji}</div>
          <h2 className="text-3xl font-bold text-ink mb-2">
            {meta.loadingMsg}
          </h2>
          <p className="text-xl text-gray-500">
            Loading {meta.label} questions...
          </p>
          <div className="mt-6 progress-track">
            <div className="progress-fill animate-pulse" style={{ width: "60%" }} />
          </div>
        </section>
      )}

      {/* ── QUESTION ── */}
      {(screen === "question" || screen === "feedback") && q && meta && (
        <section className="relative z-10 w-full max-w-2xl animate-fade-up">
          {/* Category badge + progress */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="doodle-card-sm px-4 py-1 text-lg font-bold flex items-center gap-1"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.emoji} {meta.label}
            </span>
            <span className="text-lg font-semibold text-gray-500">
              Question {qIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="progress-track mb-4">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Question card */}
          <div className="doodle-card p-5 md:p-6">
            {/* Question type label */}
            <div
              className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-3 border-2 border-ink"
              style={{ background: meta.bg, color: meta.color }}
            >
              {QUESTION_TYPE_LABELS[q.type] ?? "🍴 Question"}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4 leading-snug">
              {q.question}
            </h2>

            {/* Dish image */}
            {q.image && (
              <div className="dish-image-frame mb-5 overflow-hidden max-h-56">
                <Image
                  src={q.image}
                  alt="Dish"
                  width={600}
                  height={280}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}

            {/* Answer options */}
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                let cls = "answer-btn";
                if (selected !== null) {
                  if (i === q.correctIndex) cls += " correct";
                  else if (i === selected && i !== q.correctIndex)
                    cls += " wrong";
                  else cls += " revealed";
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                  >
                    <span
                      className="letter-badge text-sm"
                      style={
                        selected === null
                          ? { background: meta.bg, color: meta.color }
                          : {}
                      }
                    >
                      {LABELS[i]}
                    </span>
                    <span className="text-xl font-semibold capitalize">{opt}</span>
                    {selected !== null && i === q.correctIndex && (
                      <span className="ml-auto text-2xl">✅</span>
                    )}
                    {selected !== null &&
                      i === selected &&
                      i !== q.correctIndex && (
                        <span className="ml-auto text-2xl">❌</span>
                      )}
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {selected !== null && (
              <div
                className={`mt-4 p-3 rounded-xl border-2 border-ink text-center text-xl font-bold animate-bounce-in ${
                  selected === q.correctIndex
                    ? "bg-[#d4edda] text-[#155724]"
                    : "bg-[#f8d7da] text-[#721c24]"
                }`}
              >
                {selected === q.correctIndex
                  ? "🎉 Delicious! Correct!"
                  : `😬 Oops! It was "${q.options[q.correctIndex]}"`}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CATEGORY DONE ── */}
      {screen === "cat-done" && meta && (
        <section className="relative z-10 doodle-card p-8 text-center max-w-lg w-full animate-bounce-in">
          <div className="text-6xl mb-3">{meta.emoji}</div>
          <h2 className="text-4xl font-bold text-ink mb-2">
            {meta.label} Complete!
          </h2>
          <p className="text-2xl text-gray-600 mb-4">
            You scored{" "}
            <span className="font-bold" style={{ color: meta.color }}>
              {catScore} / {questions.length}
            </span>{" "}
            in this round
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-1 text-4xl mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < catScore ? "opacity-100" : "opacity-20"}>
                ⭐
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(CATEGORY_META).filter(
              (k) => !session.categories.includes(k) && k !== activeCat
            ).length > 0 && (
              <button
                onClick={playAnother}
                className="doodle-btn py-4 text-xl font-bold text-white"
                style={{ background: meta.color }}
              >
                Try another cuisine! 🌍
              </button>
            )}
            <button
              onClick={finishGame}
              className="doodle-btn py-4 text-xl font-bold text-white bg-[#386641]"
            >
              See Final Score 🏆
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
