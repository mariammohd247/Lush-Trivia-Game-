"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadSession,
  saveScore,
  getLeaderboard,
  clearSession,
  LeaderboardEntry,
} from "@/lib/storage";
import { CATEGORY_META } from "@/lib/questions";

interface Session {
  playerName: string;
  score: number;
  total: number;
  categories: string[];
}

function medal(rank: number) {
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return `${rank + 1}.`;
}

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = loadSession<Session>();
    if (!s) { router.replace("/"); return; }
    setSession(s);

    if (!saved) {
      saveScore({
        name: s.playerName,
        score: s.score,
        total: s.total || 1,
        categories: s.categories,
        date: new Date().toLocaleDateString(),
      });
      setSaved(true);
    }

    setBoard(getLeaderboard());

    // Fire celebration confetti
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, ticks: 300,
        colors: ["#F9C74F", "#90BE6D", "#0096C7", "#E85D04", "#D90429", "#386641"] });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55,
        origin: { x: 0, y: 0.6 } }), 400);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55,
        origin: { x: 1, y: 0.6 } }), 600);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const playAgain = () => {
    clearSession();
    router.push("/");
  };

  if (!session) return null;

  const pct = session.total > 0
    ? Math.round((session.score / session.total) * 100)
    : 0;

  const grade =
    pct >= 90 ? { label: "Master Chef! 👨‍🍳", color: "#386641" } :
    pct >= 70 ? { label: "Sous Chef! 🍳",      color: "#0096C7" } :
    pct >= 50 ? { label: "Line Cook! 🥄",       color: "#E85D04" } :
                { label: "Kitchen Helper 🫒",    color: "#D90429" };

  return (
    <main className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
      {/* Floating confetti-like ingredients */}
      {"🎉🍅🫒🌿🧄🌶️".split("").map((e, i) => (
        <div key={i} className="fixed pointer-events-none text-3xl opacity-20 select-none"
          style={{
            left: `${(i * 17 + 5) % 90}%`, top: `${(i * 23 + 5) % 85}%`,
            animation: `float ${3 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}>
          {e}
        </div>
      ))}

      <div className="relative z-10 w-full max-w-2xl mt-4">
        {/* Main score card */}
        <div className="doodle-card p-8 text-center mb-6 animate-bounce-in">
          <div className="text-6xl mb-2">🏆</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-1">
            {session.playerName}!
          </h1>
          <p className="text-2xl font-semibold mb-4" style={{ color: grade.color }}>
            {grade.label}
          </p>

          {/* Big score circle */}
          <div
            className="w-36 h-36 rounded-full border-4 border-ink mx-auto flex flex-col
                       items-center justify-center mb-4 shadow-doodle"
            style={{ background: `${grade.color}22` }}
          >
            <span className="text-5xl font-bold text-ink">{session.score}</span>
            <span className="text-lg text-gray-500">/ {session.total}</span>
          </div>

          <p className="text-2xl font-semibold text-gray-600 mb-4">
            {pct}% correct
          </p>

          {/* Cuisines played */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {session.categories.map((c) => {
              const m = CATEGORY_META[c];
              return m ? (
                <span key={c} className="doodle-card-sm px-3 py-1 text-lg font-semibold"
                  style={{ background: m.bg, color: m.color }}>
                  {m.emoji} {m.label}
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* Leaderboard */}
        {board.length > 0 && (
          <div className="doodle-card p-6 mb-6">
            <h2 className="text-3xl font-bold text-ink mb-4 text-center">
              🏅 Leaderboard
            </h2>
            <div className="flex flex-col gap-2">
              {board.map((entry, i) => {
                const isMe =
                  entry.name === session.playerName &&
                  entry.score === session.score;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                      isMe
                        ? "border-[#E85D04] bg-[#FFF3E6]"
                        : "border-ink bg-white"
                    }`}
                  >
                    <span className="text-2xl w-8 text-center">{medal(i)}</span>
                    <span className="flex-1 text-xl font-bold text-ink">
                      {entry.name}
                      {isMe && (
                        <span className="ml-2 text-sm font-semibold text-[#E85D04]">
                          (you!)
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-semibold text-gray-600">
                      {entry.score}/{entry.total}
                    </span>
                    <span className="text-lg font-bold" style={{
                      color: entry.score / entry.total >= 0.7 ? "#386641" : "#E85D04"
                    }}>
                      {Math.round((entry.score / entry.total) * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={playAgain}
            className="doodle-btn w-full py-4 text-2xl font-bold text-white bg-[#E85D04]"
          >
            Play Again! 🍳
          </button>
          <button
            onClick={() => router.push("/game")}
            className="doodle-btn w-full py-4 text-2xl font-bold text-white bg-[#0096C7]"
          >
            Try More Cuisines 🌍
          </button>
        </div>
      </div>
    </main>
  );
}
