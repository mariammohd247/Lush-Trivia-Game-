'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onLeave: () => void;
  onStay: () => void;
}

export function ConfirmModal({ isOpen, onLeave, onStay }: ConfirmModalProps) {
  return (
    <div className={`game-modal ${isOpen ? 'active' : ''}`}>
      <div className="game-modal-card">
        <div className="modal-icon">🏠</div>
        <h2 className="modal-title">Leave Round?</h2>
        <p className="modal-sub">Your progress will be lost.</p>
        <button className="btn-primary btn-danger" onClick={onLeave}>
          Leave
        </button>
        <button className="btn-secondary btn-secondary-modal" onClick={onStay}>
          Stay
        </button>
      </div>
    </div>
  );
}
