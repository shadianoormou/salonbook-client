'use client';
import { ErrorState } from '@/components/error-state';
export default function Error({reset}:{error:Error;reset:()=>void}){return <main id="main" className="container section"><ErrorState message="We couldn’t open this page. Please try again in a moment." retry={reset}/></main>;}
