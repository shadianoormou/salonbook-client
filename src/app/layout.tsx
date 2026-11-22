import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import './globals.css';
export const metadata:Metadata={title:{default:'SalonBook — Make time for you',template:'%s | SalonBook'},description:'Discover hair, beauty, and wellness services. Request your salon appointment and enjoy a little time for yourself.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><AuthProvider>{children}</AuthProvider></body></html>;}
