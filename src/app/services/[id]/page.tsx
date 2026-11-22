import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Protected } from '@/components/protected';
import { ServiceDetail } from '@/components/service-detail';
export default async function ServicePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <><Navbar/><main id="main"><Protected><ServiceDetail id={id}/></Protected></main><Footer/></>;}
