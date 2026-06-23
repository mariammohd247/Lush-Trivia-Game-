export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  categories: string[];
  date: string;
}

const KEY = "food-trivia-leaderboard";

export function saveScore(entry: LeaderboardEntry): void {
  if (typeof window === "undefined") return;
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score / b.total - a.score / a.total || b.score - a.score);
  localStorage.setItem(KEY, JSON.stringify(board.slice(0, 12)));
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSession(data: object): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("food-trivia-session", JSON.stringify(data));
}

export function loadSession<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("food-trivia-session");
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("food-trivia-session");
}
