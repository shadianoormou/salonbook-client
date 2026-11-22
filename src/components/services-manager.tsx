'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Plus, LoaderCircle } from 'lucide-react';
import { useLoad } from '@/lib/use-load';
import { api } from '@/lib/api';
import { Service, List, money } from '@/lib/types';
import { Loading, Badge, Empty, Pagination } from './loading';
import { ErrorState } from './error-state';
import { ConfirmDialog } from './confirm-dialog';
import { toast } from 'sonner';
export function ServicesManager() {
  const [search, setSearch] = useState(''),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<Service | null>(null),
    [busy, setBusy] = useState('');
  const { data, loading, error, reload } = useLoad<List<Service>>(
    `/admin/services?search=${encodeURIComponent(search)}&page=${page}&limit=10`,
  );
  async function toggle(s: Service) {
    setBusy(s._id);
    try {
      await api(`/admin/services/${s._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: s.status === 'active' ? 'inactive' : 'active' }),
      });
      toast.success(s.status === 'active' ? 'Service deactivated.' : 'Service is now active.');
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to update service.');
    } finally {
      setBusy('');
    }
  }
  async function remove() {
    if (!selected) return;
    setBusy(selected._id);
    try {
      await api(`/admin/services/${selected._id}`, { method: 'DELETE' });
      toast.success('Service deleted.');
      setSelected(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to delete service.');
    } finally {
      setBusy('');
    }
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">The service menu</span>
          <h1>Manage services</h1>
          <p>Keep your menu fresh. Create, refine, and make every service yours.</p>
        </div>
        <Link href="/dashboard/admin/services/new" className="button">
          <Plus size={17} />
          Add a service
        </Link>
      </div>
      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search salon services"
            placeholder="Search your service menu…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {loading ? (
        <Loading label="Getting your menu ready…" />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : !data?.data.length ? (
        <Empty
          title="A fresh menu starts here"
          description="Add your first salon service, or try a different search."
        >
          <Link className="button" href="/dashboard/admin/services/new">
            Add a service
          </Link>
        </Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="table-service">
                        <img src={s.image} alt="" />
                        <div>
                          <strong>{s.serviceName}</strong>
                          <small className="truncate">{s.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>{s.category}</td>
                    <td>{money(s.price)}</td>
                    <td>{s.duration} min</td>
                    <td>
                      <Badge value={s.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="table-link"
                          href={`/dashboard/admin/services/${s._id}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="table-link"
                          onClick={() => void toggle(s)}
                          disabled={busy === s._id}
                        >
                          {busy === s._id ? (
                            <LoaderCircle size={15} className="spin" />
                          ) : s.status === 'active' ? (
                            'Deactivate'
                          ) : (
                            'Activate'
                          )}
                        </button>
                        <button
                          className="text-danger"
                          onClick={() => setSelected(s)}
                          disabled={busy === s._id}
                        >
                          Delete
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
          title="Delete this service?"
          description="Services with appointment history must be deactivated instead, so customer bookings and payments remain available."
          confirmLabel="Delete service"
          danger
          busy={busy === selected._id}
          onCancel={() => setSelected(null)}
          onConfirm={() => void remove()}
        />
      )}
    </>
  );
}
