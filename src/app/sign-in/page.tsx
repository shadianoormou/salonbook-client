import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthForm } from '@/components/auth-form';
export const metadata={title:'Sign in'};
export default function SignIn(){return <><Navbar/><main id="main"><AuthForm mode="sign-in"/></main><Footer/></>;}
