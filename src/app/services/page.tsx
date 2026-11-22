import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BrowseServices } from '@/components/browse-services';
import { Loading } from '@/components/loading';
export const metadata = { title: 'Browse services' };
export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Suspense fallback={<Loading />}>
          <BrowseServices />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
