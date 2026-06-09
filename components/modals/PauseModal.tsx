'use client';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onQuit: () => void;
}

export function PauseModal({ isOpen, onResume, onQuit }: PauseModalProps) {
  return (
    <div className={`game-modal ${isOpen ? 'active' : ''}`}>
      <div className="game-modal-card">
        <div className="modal-icon">⏸</div>
        <h2 className="modal-title">Paused</h2>
        <button className="btn-primary" onClick={onResume}>
          Resume
        </button>
        <button className="btn-secondary btn-secondary-modal" onClick={onQuit}>
          Back to Categories
        </button>
      </div>
    </div>
  );
}
