export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail extends Meal {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  [key: string]: string | null | undefined;
}

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function getMealsByCategory(category: string): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE}/filter.php?c=${category}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.meals ?? [];
  } catch {
    return [];
  }
}

export async function getMealById(id: string): Promise<MealDetail | null> {
  try {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRandomMeal(): Promise<MealDetail | null> {
  try {
    const res = await fetch(`${BASE}/random.php`, { cache: "no-store" });
    const data = await res.json();
    return data.meals?.[0] ?? null;
  } catch {
    return null;
  }
}

export function getIngredients(meal: MealDetail): string[] {
  const result: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim()) result.push(ing.trim());
  }
  return result;
}
