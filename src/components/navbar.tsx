'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Scissors, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './auth-provider';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="SalonBook home">
      <span className="logo-mark">
        <Scissors size={21} />
      </span>
      Salon<span>Book</span>
    </Link>
  );
}
export function Navbar() {
  const { user, loading } = useAuth(),
    [open, setOpen] = useState(false),
    path = usePathname(),
    router = useRouter();
  async function logout() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || 'Could not sign out.');
      return;
    }
    setOpen(false);
    toast.success('Signed out.');
    router.push('/');
    router.refresh();
  }
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={path === '/' ? 'active' : ''} href="/">
            Home
          </Link>
          <Link className={path.startsWith('/services') ? 'active' : ''} href="/services">
            Browse services
          </Link>
          <Link href="/#our-approach">Our approach</Link>
          <Link href="/#visit">Visit us</Link>
        </nav>
        <div className="nav-actions">
          {loading ? (
            <span className="nav-placeholder" />
          ) : user ? (
            <details className="profile-menu">
              <summary>
                {user.image ? (
                  <img src={user.image} alt="" />
                ) : (
                  <span className="avatar">{user.name.slice(0, 1)}</span>
                )}
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </summary>
              <div className="dropdown">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <Link href={`/dashboard/${user.role}`}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button onClick={logout}>
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link className="sign-in-link" href="/sign-in">
                Sign in
              </Link>
              <Link className="button small" href="/sign-up">
                Get started
              </Link>
            </>
          )}
          <button
            className="icon-button mobile-menu"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {[
            ['/', 'Home'],
            ['/services', 'Browse services'],
            ['/#our-approach', 'Our approach'],
            ['/#visit', 'Visit us'],
            ...(!user ? [['/sign-in', 'Sign in']] : []),
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
