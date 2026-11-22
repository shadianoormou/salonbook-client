'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { useLoad } from '@/lib/use-load';
import { api, uploadImage } from '@/lib/api';
import { Service, categories } from '@/lib/types';
import { Loading } from './loading';
import { ErrorState } from './error-state';
import { toast } from 'sonner';
export function ServiceForm({ id }: { id?: string }) {
  const existing = useLoad<{ data: Service }>(id ? `/services/${id}` : null),
    router = useRouter();
  const [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      if (!file && !existing.data?.data.image)
        throw new Error('Please upload an image for this service.');
      const image = file ? await uploadImage(file) : existing.data!.data.image;
      const body = {
        serviceName: String(form.get('serviceName')).trim(),
        category: String(form.get('category')),
        description: String(form.get('description')).trim(),
        price: Number(form.get('price')),
        duration: Number(form.get('duration')),
        status: String(form.get('status')),
        image,
      };
      await api(`/admin/services${id ? `/${id}` : ''}`, {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(body),
      });
      toast.success(id ? 'Service updated.' : 'A fresh service has been added.');
      router.push('/dashboard/admin/services');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to save service.';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }
  if (id && existing.loading) return <Loading label="Opening your service…" />;
  if (id && existing.error) return <ErrorState message={existing.error} retry={existing.reload} />;
  const s = existing.data?.data;
  return (
    <>
      <Link className="back-link" href="/dashboard/admin/services">
        Back to the service menu
      </Link>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">A thoughtful menu</span>
          <h1>{id ? 'Refine your service.' : 'Something new to love.'}</h1>
          <p>
            {id
              ? 'Update the little details that make a service special.'
              : 'Create a service your customers will look forward to.'}
          </p>
        </div>
      </div>
      <form className="service-form-grid" onSubmit={submit} key={id || 'new'}>
        <div className="panel form-panel">
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="field">
            <label htmlFor="serviceName">Service name</label>
            <input
              id="serviceName"
              name="serviceName"
              defaultValue={s?.serviceName}
              required
              minLength={3}
              maxLength={100}
              placeholder="e.g. Signature Cut & Finish"
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" required defaultValue={s?.category || ''}>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={3000}
              defaultValue={s?.description}
              placeholder="Help customers picture their experience…"
              rows={6}
            />
            <p className="field-hint">
              At least 20 characters. Tell them what makes this service special.
            </p>
          </div>
          <div className="two-fields">
            <div className="field">
              <label htmlFor="price">Price (USD)</label>
              <input
                id="price"
                name="price"
                required
                type="number"
                min="0.01"
                max="10000"
                step="0.01"
                defaultValue={s?.price}
                placeholder="45.00"
              />
            </div>
            <div className="field">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                id="duration"
                name="duration"
                required
                type="number"
                min="1"
                max="480"
                step="1"
                defaultValue={s?.duration}
                placeholder="60"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="service-status">Service status</label>
            <select id="service-status" name="status" defaultValue={s?.status || 'active'}>
              <option value="active">Active · Available to customers</option>
              <option value="inactive">Inactive · Hidden from customers</option>
            </select>
          </div>
          <button className="button" disabled={busy}>
            {busy && <LoaderCircle className="spin" size={17} />}{' '}
            {busy ? 'Saving your service…' : id ? 'Save changes' : 'Create service'}
          </button>
        </div>
        <aside>
          <div className="panel form-panel">
            <h2>A picture of the experience</h2>
            <p className="panel-description">Add a clear image that feels true to your service.</p>
            {preview || s?.image ? (
              <img
                className="upload-preview"
                src={preview || s?.image}
                alt="Service image preview"
              />
            ) : null}
            <label htmlFor="service-image" className="upload-zone">
              <ImagePlus size={30} />
              <strong>{file ? file.name : 'Choose a service image'}</strong>
              <span>JPG, PNG, or WebP · Up to 5 MB</span>
            </label>
            <input
              id="service-image"
              className="visually-hidden"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={!id}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="notice">
            Active services appear on your public menu and are available for appointment requests.
          </div>
        </aside>
      </form>
    </>
  );
}
