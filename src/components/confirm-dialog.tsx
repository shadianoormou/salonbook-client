'use client';
import { useEffect, useRef } from 'react';
import { X, LoaderCircle } from 'lucide-react';
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  busy = false,
  danger = false,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  danger?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <button
        className="dialog-close icon-button"
        aria-label="Close"
        onClick={onCancel}
        disabled={busy}
      >
        <X size={18} />
      </button>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onCancel} disabled={busy}>
          Keep it
        </button>
        <button className={`button ${danger ? 'danger' : ''}`} onClick={onConfirm} disabled={busy}>
          {busy && <LoaderCircle className="spin" size={16} />} {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
