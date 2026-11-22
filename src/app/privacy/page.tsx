import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata = { title: 'Privacy | SalonBook' };

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="container"
        style={{ maxWidth: 800, paddingTop: 64, paddingBottom: 80 }}
      >
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1>Privacy at SalonBook</h1>
        <p>SalonBook is an educational salon booking application. Updated November 22, 2026.</p>
        <h2>Information we use</h2>
        <p>
          We store your account name, email, optional phone number and profile image, appointments,
          and payment records to provide account access and booking management. Passwords are stored
          as hashes. Session cookies keep you signed in.
        </p>
        <h2>Google sign-in</h2>
        <p>
          If you choose Google sign-in, we request only your basic profile, name, email address, and
          profile image. We use these to create and authenticate your SalonBook account. We do not
          request access to your Gmail, Drive, or contacts.
        </p>
        <h2>Services and sharing</h2>
        <p>
          Vercel hosts the application and MongoDB Atlas stores application records. Salon
          administrators can access customer and appointment information to manage bookings. Images
          you upload are sent to ImgBB and receive a publicly accessible image URL; upload only
          images you intend to share. When payments are enabled, Stripe handles card details;
          SalonBook stores payment references and status, not card numbers.
        </p>
        <h2>Your choices</h2>
        <p>
          You can update your profile and sign out from your dashboard. You can revoke Google access
          in your Google Account settings. For account or data deletion requests, contact{' '}
          <a href="mailto:moushadianoor@gmail.com">moushadianoor@gmail.com</a>. Revoking Google
          access does not itself delete stored booking records.
        </p>
      </main>
      <Footer />
    </>
  );
}
