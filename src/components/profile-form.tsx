'use client';
import { useEffect, useState } from 'react';
import { Camera, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from './auth-provider';
import { api, uploadImage } from '@/lib/api';
import { toast } from 'sonner';
export function ProfileForm() {
  const { user, refresh } = useAuth(),
    [name, setName] = useState(user?.name || ''),
    [phone, setPhone] = useState(user?.phone || ''),
    [image, setImage] = useState(user?.image || ''),
    [file, setFile] = useState<File | null>(null),
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
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const photo = file ? await uploadImage(file) : image;
      await api('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, image: photo }),
      });
      toast.success('Your profile is looking good.');
      await refresh();
      setImage(photo);
      setFile(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to update profile.';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">The person behind the appointment</span>
          <h1>My profile</h1>
          <p>A little space for your details. Keep them just right.</p>
        </div>
      </div>
      <div className="profile-grid">
        <aside className="panel profile-summary">
          {preview || image ? (
            <img className="profile-photo" src={preview || image} alt={name} />
          ) : (
            <span className="profile-photo profile-initial">{name.slice(0, 1)}</span>
          )}
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className="badge active">
            {user?.role === 'admin' ? 'Administrator' : 'SalonBook member'}
          </span>
          <div className="profile-note">
            <ShieldCheck size={20} />
            <p>Your account permissions are managed securely by the salon.</p>
          </div>
        </aside>
        <form className="panel form-panel" onSubmit={submit}>
          <h2>Your details</h2>
          <p className="panel-description">The small details that help us take care of you.</p>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="field">
            <label htmlFor="profile-name">Full name</label>
            <input
              id="profile-name"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="profile-email">Email address</label>
            <input id="profile-email" type="email" value={user?.email || ''} readOnly />
            <p className="field-hint">Your sign-in email is kept secure.</p>
          </div>
          <div className="field">
            <label htmlFor="phone">
              Phone number <span className="muted">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your contact number"
            />
          </div>
          <div className="field">
            <label htmlFor="profile-upload">Profile photo</label>
            <label className="upload-zone" htmlFor="profile-upload">
              <Camera size={24} />
              <strong>{file ? file.name : 'Choose a new photo'}</strong>
              <span>JPG, PNG, or WebP · Up to 5 MB</span>
            </label>
            <input
              className="visually-hidden"
              id="profile-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="field">
            <label htmlFor="profile-image">Or use an image URL</label>
            <input
              id="profile-image"
              type="url"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setFile(null);
              }}
              placeholder="https://…"
            />
          </div>
          <button className="button" disabled={busy}>
            {busy && <LoaderCircle size={17} className="spin" />}
            {busy ? 'Saving your details…' : 'Save changes'}
          </button>
        </form>
      </div>
    </>
  );
}
