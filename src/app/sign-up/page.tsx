import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthForm } from '@/components/auth-form';
export const metadata = { title: 'Create your account' };
export default function SignUp() {
  return (
    <>
      <Navbar />
      <main id="main">
        <AuthForm mode="sign-up" />
      </main>
      <Footer />
    </>
  );
}
