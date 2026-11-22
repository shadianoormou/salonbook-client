'use client';
import { useEffect } from 'react';
import { usePathname,useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Loading } from './loading';
import { ErrorState } from './error-state';
import { authClient } from '@/lib/auth-client';
export function Protected({children,role}:{children:React.ReactNode;role?:'admin'|'customer'}){
  const {user,loading,error,refresh}=useAuth(),router=useRouter(),pathname=usePathname();
  useEffect(()=>{if(loading||error)return;if(!user)router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);else if(role&&user.role!==role)router.replace(`/dashboard/${user.role}`);},[user,loading,error,role,router,pathname]);
  if(loading)return <Loading label="Opening your SalonBook space…"/>;
  if(error)return <div className="container section"><ErrorState message={error} retry={()=>void refresh()}/><div className="center-actions"><button className="button secondary" onClick={async()=>{await authClient.signOut();router.push('/sign-in');}}>Back to sign in</button></div></div>;
  if(!user||(role&&user.role!==role))return <Loading label="Taking you to the right place…"/>;
  return <>{children}</>;
}
