import { Protected } from '@/components/protected';
import { ServiceForm } from '@/components/service-form';
export default async function EditService({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Protected role="admin"><ServiceForm id={id}/></Protected>;}
