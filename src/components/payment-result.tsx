'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { CircleCheck, Clock, CircleX } from 'lucide-react';
import { useLoad } from '@/lib/use-load';
import { Appointment } from '@/lib/types';
import { ErrorState } from './error-state';
export function PaymentResult({ cancelled = false }: { cancelled?: boolean }) {
  const query = useSearchParams(),
    id = query.get('appointment');
  const { data, error, reload } = useLoad<{ data: Appointment }>(id ? `/appointments/${id}` : null);
  const paid = data?.data.paymentStatus === 'paid';
  useEffect(() => {
    if (cancelled || paid || !id) return;
    const timer = setInterval(reload, 3000);
    return () => clearInterval(timer);
  }, [paid, cancelled, id, reload]);
  return (
    <section className="container payment-result">
      <div className="payment-result-card">
        <span className={`payment-symbol ${cancelled ? 'cancelled' : ''}`}>
          {paid ? (
            <CircleCheck size={42} />
          ) : cancelled ? (
            <CircleX size={42} />
          ) : (
            <Clock size={42} />
          )}
        </span>
        <span className="eyebrow">
          {paid ? 'All taken care of' : cancelled ? 'A little pause' : 'One last check'}
        </span>
        <h1>
          {paid
            ? 'Your payment is confirmed.'
            : cancelled
              ? 'Checkout was cancelled.'
              : 'We’re confirming your payment.'}
        </h1>
        <p>
          {paid
            ? 'Your payment has been securely verified. We’re looking forward to your visit.'
            : cancelled
              ? 'You can return to your confirmed appointment and try payment again whenever you’re ready.'
              : 'Stripe has returned you to SalonBook. We’ll update your appointment as soon as secure payment confirmation arrives.'}
        </p>
        {error && <ErrorState message={error} retry={reload} />}
        <Link className="button" href="/dashboard/customer/appointments">
          My appointments
        </Link>
        {!paid && !cancelled && (
          <button className="button secondary" onClick={reload}>
            Check payment status
          </button>
        )}
        <p className="field-hint">
          {!id
            ? 'Open your appointments to view the latest payment status.'
            : `Appointment reference: ${id.slice(-8).toUpperCase()}`}
        </p>
      </div>
    </section>
  );
}
