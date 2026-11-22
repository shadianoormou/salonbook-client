'use client';
import { useEffect, useRef } from 'react';
import { User, dateLabel } from '@/lib/types';
export function CustomerDetails({
  customer,
  onClose,
}: {
  customer: User & { createdAt: string };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return (
    <dialog
      className="confirm-dialog customer-detail-modal"
      ref={ref}
      aria-labelledby="customer-detail-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <h2 id="customer-detail-title">{customer.name}</h2>
      <dl>
        <dt>Email</dt>
        <dd>{customer.email}</dd>
        <dt>Phone</dt>
        <dd>{customer.phone || 'Not provided'}</dd>
        <dt>Joined</dt>
        <dd>{dateLabel(customer.createdAt)}</dd>
        <dt>Access</dt>
        <dd>{customer.isBlocked ? 'Blocked' : 'Active'}</dd>
      </dl>
      <button className="button secondary" onClick={onClose}>
        Close details
      </button>
    </dialog>
  );
}
