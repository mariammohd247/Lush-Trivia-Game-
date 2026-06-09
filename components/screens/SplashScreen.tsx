'use client';

interface SplashScreenProps {
  onStart: () => void;
  onViewScores: () => void;
}

export function SplashScreen({ onStart, onViewScores }: SplashScreenProps) {
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
      <div className="splash-inner">
        <img
          src="https://lushlebanon.com/cdn/shop/files/lush_logo_for_web_black_en_trimmed.webp?height=160&v=1771442126"
          alt="LUSH"
          className="lush-logo-img"
        />
        <p className="splash-tagline">
          Welcome aboard,<br />your journey starts here!
        </p>
        <div className="splash-chips">
          <span className="wcat" style={{ '--wc': '#7B2D8B' } as React.CSSProperties}>Bath &amp; Shower</span>
          <span className="wcat" style={{ '--wc': '#006B3D' } as React.CSSProperties}>Hair &amp; Body</span>
          <span className="wcat" style={{ '--wc': '#4A148C' } as React.CSSProperties}>Fragrances</span>
          <span className="wcat" style={{ '--wc': '#1a1a1a' } as React.CSSProperties}>6 Values</span>
        </div>
        <button className="btn-primary splash-btn" onClick={onStart}>
          Start Playing →
        </button>
        <button className="welcome-scores-link" onClick={onViewScores}>
          View high scores
        </button>
      </div>
    </>
  );
}
