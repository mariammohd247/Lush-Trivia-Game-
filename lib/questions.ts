import { getMealsByCategory, getMealById, getIngredients, MealDetail } from "./api";

export type QuestionType =
  | "image-name"
  | "main-ingredient"
  | "cuisine-origin"
  | "dish-category"
  | "not-ingredient";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  funFact?: string;
}

export const CATEGORY_META: Record<
  string,
  { label: string; emoji: string; color: string; bg: string; mealCategories: string[]; loadingMsg: string }
> = {
  fridge: {
    label: "Fridge",
    emoji: "❄️",
    color: "#0096C7",
    bg: "#E0F7FF",
    mealCategories: ["Dessert", "Starter"],
    loadingMsg: "Cooling up the fridge! ❄️",
  },
  stove: {
    label: "Stove",
    emoji: "🔥",
    color: "#D62828",
    bg: "#FFE8E8",
    mealCategories: ["Beef", "Chicken", "Lamb", "Pasta"],
    loadingMsg: "Firing up the stove! 🔥",
  },
  sink: {
    label: "Sink",
    emoji: "🚰",
    color: "#2D9CDB",
    bg: "#E8F5FF",
    mealCategories: ["Seafood", "Vegetarian", "Vegan"],
    loadingMsg: "Sink dripping... 🚰",
  },
  frier: {
    label: "Frier",
    emoji: "🍟",
    color: "#D4880E",
    bg: "#FFF8E1",
    mealCategories: ["Pork", "Breakfast", "Miscellaneous"],
    loadingMsg: "Oil boiling... 🍟",
  },
};

const FOOD_CATEGORIES = [
  "Beef", "Chicken", "Seafood", "Vegetarian", "Pasta",
  "Dessert", "Starter", "Pork", "Lamb", "Side",
];

const ALL_AREAS = [
  "Italian", "Indian", "Chinese", "Greek", "Japanese",
  "Mexican", "French", "Thai", "Moroccan", "British",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function insertAtRandom<T>(arr: T[], item: T): [T[], number] {
  const idx = Math.floor(Math.random() * (arr.length + 1));
  const result = [...arr];
  result.splice(idx, 0, item);
  return [result, idx];
}

export async function generateQuestions(categoryKey: string): Promise<Question[]> {
  const meta = CATEGORY_META[categoryKey];
  if (!meta) throw new Error("Unknown category");

  // Fetch meal lists from all TheMealDB categories for this kitchen station
  const lists = await Promise.all(meta.mealCategories.map((c) => getMealsByCategory(c)));
  const all = shuffle(lists.flat());

  if (all.length < 4) throw new Error("Not enough meals from API");

  // Fetch full details for up to 10 meals (first 5 are question subjects, rest are pool)
  const toFetch = all.slice(0, 10);
  const details = (
    await Promise.all(toFetch.map((m) => getMealById(m.idMeal)))
  ).filter((m): m is MealDetail => m !== null);

  if (details.length < 4) throw new Error("Not enough meal details");

  const questions: Question[] = [];
  const used = new Set<string>();

  // Cycle through question types
  const types: QuestionType[] = [
    "image-name",
    "main-ingredient",
    "cuisine-origin",
    "dish-category",
    "not-ingredient",
  ];

  for (let attempt = 0; attempt < details.length && questions.length < 5; attempt++) {
    const meal = details.find((m) => !used.has(m.idMeal));
    if (!meal) break;

    const type = types[questions.length % types.length];
    const pool = details.filter((m) => m.idMeal !== meal.idMeal);
    const q = buildQuestion(meal, pool, type);

    if (q) {
      used.add(meal.idMeal);
      questions.push(q);
    } else {
      // Try with a different type
      for (const fallback of types) {
        const fq = buildQuestion(meal, pool, fallback);
        if (fq) {
          used.add(meal.idMeal);
          questions.push(fq);
          break;
        }
      }
      if (!used.has(meal.idMeal)) used.add(meal.idMeal);
    }
  }

  if (questions.length < 3) throw new Error("Could not generate enough questions");
  return questions;
}

function buildQuestion(
  meal: MealDetail,
  pool: MealDetail[],
  type: QuestionType
): Question | null {
  switch (type) {
    case "image-name": {
      if (!meal.strMealThumb) return null;
      const wrongs = pick(
        pool.map((m) => m.strMeal).filter((n) => n !== meal.strMeal),
        3
      );
      if (wrongs.length < 3) return null;
      const [options, correctIndex] = insertAtRandom(wrongs, meal.strMeal);
      return {
        id: `${meal.idMeal}-img`,
        type,
        question: "What is the name of this dish?",
        image: meal.strMealThumb,
        options,
        correctIndex,
      };
    }

    case "main-ingredient": {
      const ings = getIngredients(meal);
      if (ings.length === 0) return null;
      const main = ings[0];
      const poolIngs = [
        ...new Set(pool.flatMap(getIngredients).filter((i) => i !== main)),
      ];
      const wrongs = pick(poolIngs, 3);
      if (wrongs.length < 3) return null;
      const [options, correctIndex] = insertAtRandom(wrongs, main);
      return {
        id: `${meal.idMeal}-ing`,
        type,
        question: `What is the main ingredient in "${meal.strMeal}"?`,
        image: meal.strMealThumb || undefined,
        options,
        correctIndex,
      };
    }

    case "cuisine-origin": {
      const correct = meal.strArea;
      if (!correct) return null;
      const wrongs = pick(
        ALL_AREAS.filter((a) => a !== correct),
        3
      );
      if (wrongs.length < 3) return null;
      const [options, correctIndex] = insertAtRandom(wrongs, correct);
      return {
        id: `${meal.idMeal}-orig`,
        type,
        question: `Which cuisine does "${meal.strMeal}" come from?`,
        image: meal.strMealThumb || undefined,
        options,
        correctIndex,
      };
    }

    case "dish-category": {
      const correct = meal.strCategory;
      if (!correct) return null;
      const wrongs = pick(
        FOOD_CATEGORIES.filter((c) => c !== correct),
        3
      );
      if (wrongs.length < 3) return null;
      const [options, correctIndex] = insertAtRandom(wrongs, correct);
      return {
        id: `${meal.idMeal}-cat`,
        type,
        question: `What food category does "${meal.strMeal}" belong to?`,
        image: meal.strMealThumb || undefined,
        options,
        correctIndex,
      };
    }

    case "not-ingredient": {
      const ings = getIngredients(meal);
      if (ings.length < 3) return null;
      const mealIngs = pick(ings, 3);
      const poolIngs = [
        ...new Set(pool.flatMap(getIngredients).filter((i) => !ings.includes(i))),
      ];
      const impostor = pick(poolIngs, 1)[0];
      if (!impostor) return null;
      const options = shuffle([...mealIngs, impostor]);
      const correctIndex = options.indexOf(impostor);
      return {
        id: `${meal.idMeal}-not`,
        type,
        question: `Which ingredient is NOT in "${meal.strMeal}"?`,
        image: meal.strMealThumb || undefined,
        options,
        correctIndex,
      };
    }
  }
}
