'use client';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  CheckCheck,
  XCircle,
  Users,
  Scissors,
  CreditCard,
} from 'lucide-react';
import { useAuth } from './auth-provider';
import { useLoad } from '@/lib/use-load';
import { List, Appointment, dateLabel, money, timeLabel } from '@/lib/types';
import { Loading, Badge, Empty } from './loading';
import { ErrorState } from './error-state';
type Overview = {
  totalAppointments: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  customers?: number;
  services?: number;
  payments?: number;
};
export function DashboardOverview() {
  const { user } = useAuth(),
    admin = user?.role === 'admin',
    base = `/dashboard/${user?.role}`;
  const overview = useLoad<{ data: Overview }>('/overview'),
    recent = useLoad<List<Appointment>>(`${admin ? '/admin' : ''}/appointments?limit=4`);
  if (overview.loading) return <Loading label="Preparing your dashboard…" />;
  if (overview.error) return <ErrorState message={overview.error} retry={overview.reload} />;
  const d = overview.data?.data;
  const stats = admin
    ? ([
        ['Registered customers', d?.customers, Users],
        ['Active services', d?.services, Scissors],
        ['Appointment requests', d?.totalAppointments, CalendarDays],
        ['Pending appointments', d?.pending, Clock],
        ['Confirmed appointments', d?.confirmed, CheckCheck],
        ['Successful payments', d?.payments, CreditCard],
      ] as const)
    : ([
        ['Total requests', d?.totalAppointments, CalendarDays],
        ['Pending', d?.pending, Clock],
        ['Confirmed', d?.confirmed, CheckCheck],
        ['Cancelled', d?.cancelled, XCircle],
      ] as const);
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            {admin ? 'Your salon at a glance' : 'Your own little space'}
          </span>
          <h1>{admin ? 'A good day starts here.' : `Hello, ${user?.name.split(' ')[0]}.`}</h1>
          <p>
            {admin
              ? 'A clear view of your services, appointments, and customers.'
              : 'A little less planning. A little more looking forward.'}
          </p>
        </div>
        <Link className="button" href={admin ? `${base}/services/new` : '/services'}>
          {admin ? 'Add a service' : 'Book a little self-care'}
        </Link>
      </div>
      <div className={`stats-grid ${admin ? 'admin-stats' : ''}`}>
        {stats.map(([label, value, Icon], i) => (
          <article className="stat-card" key={label}>
            <div>
              <span>{label}</span>
              <strong>{value ?? 0}</strong>
            </div>
            <span className={`stat-icon tone-${i % 4}`}>
              <Icon size={20} strokeWidth={1.6} />
            </span>
          </article>
        ))}
      </div>
      <div className="overview-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent appointments</h2>
              <p>A little look at what’s coming up.</p>
            </div>
            <Link href={`${base}/appointments`}>View all</Link>
          </div>
          {recent.loading ? (
            <Loading />
          ) : recent.error ? (
            <ErrorState message={recent.error} retry={recent.reload} />
          ) : recent.data?.data.length ? (
            <div className="recent-list">
              {recent.data.data.map((a) => (
                <Link href={`${base}/appointments/${a._id}`} key={a._id}>
                  <span className="recent-icon">
                    <CalendarDays size={20} />
                  </span>
                  <div>
                    <strong>{a.service?.serviceName || a.serviceName}</strong>
                    <span>
                      {dateLabel(a.appointmentDate)} · {timeLabel(a.timeSlot)}
                    </span>
                  </div>
                  <div className="recent-status">
                    <Badge value={a.status} />
                    <span>{money(a.servicePrice, a.currency)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              title="Your next moment is waiting"
              description={
                admin
                  ? 'Appointment requests will appear here.'
                  : 'Find a service you love and request your first appointment.'
              }
            />
          )}
        </section>
        <aside className="overview-aside">
          <div className="care-card">
            <span className="eyebrow">Good to know</span>
            <h2>{admin ? 'Small details. Better visits.' : 'A simple path to a little care.'}</h2>
            <p>
              {admin
                ? 'Review pending requests, confirm the time, and let your customers know what to look forward to.'
                : 'Request your appointment, wait for our team to confirm, then pay securely from your dashboard.'}
            </p>
            <Link className="button light" href={`${base}/appointments`}>
              {admin ? 'Review appointments' : 'My appointments'}
            </Link>
          </div>
          <div className="gentle-card">
            <Scissors size={24} />
            <h3>{admin ? 'Keep your menu fresh.' : 'In the mood for something new?'}</h3>
            <p>
              {admin
                ? 'Update your services, refresh an image, or add something your customers will love.'
                : 'Explore our menu and discover a new favourite.'}
            </p>
            <Link className="text-link" href={admin ? `${base}/services` : '/services'}>
              {admin ? 'Manage services' : 'Explore services'}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
