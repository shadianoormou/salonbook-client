import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Protected } from '@/components/protected';
import { PaymentResult } from '@/components/payment-result';
import { Loading } from '@/components/loading';
export default function Success(){return <><Navbar/><main id="main"><Protected role="customer"><Suspense fallback={<Loading/>}><PaymentResult/></Suspense></Protected></main><Footer/></>;}
