import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="not-found container">
        <span className="eyebrow">A little detour</span>
        <span className="not-found-number">404</span>
        <h1>
          This moment seems
          <br />
          to have wandered off.
        </h1>
        <p>
          The page you’re looking for isn’t here.
          <br />
          Let’s find you something lovely instead.
        </p>
        <Link className="button" href="/services">
          Explore our services
        </Link>
        <Link className="text-link" href="/">
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
