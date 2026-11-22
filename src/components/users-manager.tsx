'use client';
import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useLoad } from '@/lib/use-load';
import { api } from '@/lib/api';
import { User, List, dateLabel } from '@/lib/types';
import { Loading, Badge, Empty, Pagination } from './loading';
import { ErrorState } from './error-state';
import { ConfirmDialog } from './confirm-dialog';
import { CustomerDetails } from './customer-details';
import { toast } from 'sonner';
type Customer = User & { _id: string; createdAt: string };
export function UsersManager() {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<Customer | null>(null),
    [details, setDetails] = useState<Customer | null>(null),
    [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useLoad<List<Customer>>(
    `/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=10`,
  );
  async function toggle() {
    if (!selected) return;
    setBusy(true);
    try {
      await api(`/admin/users/${selected._id}/block`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked: !selected.isBlocked }),
      });
      toast.success(selected.isBlocked ? 'Customer unblocked.' : 'Customer blocked.');
      setSelected(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to update customer.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">The people who make your salon</span>
          <h1>Customers</h1>
          <p>Find your members, view their details, and manage platform access.</p>
        </div>
        <span className="count-label">{data?.total || 0} registered customers</span>
      </div>
      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search customers by name or email"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {loading ? (
        <Loading label="Finding your customers…" />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : !data?.data.length ? (
        <Empty
          title="No customers found"
          description="Try another name or email. New members will appear here when they join."
        />
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="table-service">
                        {c.image ? (
                          <img src={c.image} alt="" />
                        ) : (
                          <span className="avatar">{c.name.slice(0, 1)}</span>
                        )}
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{dateLabel(c.createdAt)}</td>
                    <td>
                      <Badge value={c.isBlocked ? 'blocked' : 'active'} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="table-link" onClick={() => setDetails(c)}>
                          <Eye size={15} />
                          Details
                        </button>
                        <button
                          className={c.isBlocked ? 'table-link' : 'text-danger'}
                          onClick={() => setSelected(c)}
                        >
                          {c.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
      {selected && (
        <ConfirmDialog
          title={`${selected.isBlocked ? 'Unblock' : 'Block'} ${selected.name}?`}
          description={
            selected.isBlocked
              ? 'This customer will be able to use protected salon features again.'
              : 'This customer will lose access to protected salon features, including bookings and payments.'
          }
          confirmLabel={selected.isBlocked ? 'Unblock customer' : 'Block customer'}
          danger={!selected.isBlocked}
          busy={busy}
          onCancel={() => setSelected(null)}
          onConfirm={() => void toggle()}
        />
      )}
      {details && <CustomerDetails customer={details} onClose={() => setDetails(null)} />}
    </>
  );
}
