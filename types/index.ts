export type Screen = 'splash' | 'welcome' | 'categories' | 'question' | 'results';
export type CategoryKey = 'bath-shower' | 'hair-body' | 'fragrances' | 'values';

export interface Answer {
  label: string;
  text: string;
  correct?: boolean;
}

export interface Question {
  id: string;
  type: 'text' | 'product';
  question: string;
  answers: Answer[];
  explanation: string;
  productImage?: string;
  productDetail?: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
  gradient: string;
  image: string;
  description: string;
}

export interface Score {
  name: string;
  score: number;
  category: CategoryKey;
  date: string;
}

export interface GameState {
  screen: Screen;
  playerName: string;
  category: CategoryKey | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  answered: boolean;
}
