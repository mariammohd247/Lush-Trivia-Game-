'use client';
import { useState } from 'react';

interface NameEntryScreenProps {
  onStart: (name: string) => void;
}

export function NameEntryScreen({ onStart }: NameEntryScreenProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onStart(trimmed);
  }

  return (
    <>
      <div className="welcome-bg">
        <div className="wb wb-1" />
        <div className="wb wb-2" />
        <div className="wb wb-3" />
        <div className="wb wb-4" />
        <div className="wb wb-5" />
        <div className="wb wb-6" />
      </div>
      <div className="name-entry-inner">
        <img
          src="https://lushlebanon.com/cdn/shop/files/lush_logo_for_web_black_en_trimmed.webp?height=160&v=1771442126"
          alt="LUSH"
          className="lush-logo-img lush-logo-img--sm"
        />
        <p className="name-entry-sub">Who&apos;s playing today?</p>
        <form className="welcome-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label htmlFor="player-name">Your name</label>
          <input
            id="player-name"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <button id="start-btn" type="submit">
            Let&apos;s Play!
          </button>
        </form>
      </div>
    </>
  );
}
