'use client';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle-btn" onClick={toggle} title="Toggle light / dark mode">
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
