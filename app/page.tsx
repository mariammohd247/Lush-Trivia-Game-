"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/storage";

const FLOATERS = [
  { e: "🍅", x: 8,  y: 12, d: 0 },
  { e: "🫒", x: 88, y: 8,  d: 0.4 },
  { e: "🌿", x: 15, y: 75, d: 0.8 },
  { e: "🧄", x: 80, y: 70, d: 1.2 },
  { e: "🌶️", x: 5,  y: 45, d: 0.6 },
  { e: "🥕", x: 92, y: 40, d: 1.0 },
  { e: "🧅", x: 50, y: 5,  d: 0.3 },
  { e: "🍋", x: 72, y: 88, d: 0.9 },
  { e: "🫑", x: 28, y: 90, d: 1.5 },
  { e: "🥦", x: 62, y: 15, d: 0.7 },
  { e: "🍄", x: 40, y: 82, d: 0.2 },
  { e: "🧀", x: 20, y: 30, d: 1.3 },
];

export default function WelcomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    const trimmed = name.trim() || "Chef";
    saveSession({ playerName: trimmed, score: 0, total: 0, categories: [] });
    router.push("/game");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Floating ingredients */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none text-4xl opacity-25"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            animation: `float ${3 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${f.d}s`,
          }}
        >
          {f.e}
        </div>
      ))}

      {/* Main card */}
      <div className="relative z-10 doodle-card p-8 md:p-12 max-w-lg w-full text-center">
        {/* Fork & knife header decoration */}
        <div className="text-5xl mb-2">🍴</div>

        <h1 className="text-5xl md:text-6xl font-bold text-ink leading-tight mb-3">
          Food Trivia<br />
          <span className="text-[#E85D04]">Challenge!</span>
        </h1>

        {/* Doodle underline */}
        <svg
          viewBox="0 0 200 12"
          className="w-48 mx-auto mb-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8 Q20 2, 40 8 Q60 14, 80 8 Q100 2, 120 8 Q140 14, 160 8 Q180 2, 196 8"
            stroke="#F9C74F"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Tagline */}
        <div className="doodle-card-sm bg-[#FFF8E1] px-4 py-3 mb-8 inline-block">
          <p className="text-xl md:text-2xl text-ink font-semibold italic leading-snug">
            "Put your hairnet on because<br />
            <span className="text-[#D90429]">something is cooking! 🔥</span>"
          </p>
        </div>

        {/* Name input */}
        <div className="mb-6 text-left">
          <label className="block text-xl font-semibold text-ink mb-2">
            👨‍🍳 What's your name, Chef?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && start()}
            placeholder="Enter your name..."
            maxLength={24}
            className="w-full border-[3px] border-ink rounded-xl px-4 py-3 text-xl
                       bg-white shadow-doodle outline-none focus:shadow-doodle-hover
                       focus:translate-x-[-1px] focus:translate-y-[-1px]
                       transition-all placeholder:text-gray-400 font-fredoka"
          />
        </div>

        {/* Start button */}
        <button
          onClick={start}
          className="doodle-btn w-full py-4 text-2xl font-bold text-white
                     bg-[#E85D04] hover:bg-[#cc5004]"
        >
          Let's Cook! 🍳
        </button>

        {/* Category preview */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          {["❄️ Fridge", "🔥 Stove", "🚰 Sink", "🍟 Frier"].map(
            (c) => (
              <span
                key={c}
                className="text-sm font-semibold border-2 border-ink rounded-full
                           px-3 py-1 bg-cream shadow-doodle-sm"
              >
                {c}
              </span>
            )
          )}
        </div>
      </div>
    </main>
  );
}
