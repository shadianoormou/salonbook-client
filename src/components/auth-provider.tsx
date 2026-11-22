'use client';
import { createContext,useContext,useEffect,useState,useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { api,ApiError } from '@/lib/api';
import { User } from '@/lib/types';
import { Toaster } from 'sonner';
type Auth={user:User|null;loading:boolean;error:string;refresh:()=>Promise<void>};
const Context=createContext<Auth>({user:null,loading:true,error:'',refresh:async()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}){
  const {data:session,isPending}=authClient.useSession();
  const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refresh=useCallback(async()=>{
    setLoading(true);setError('');
    try{const result=await api<{data:User}>('/profile');setUser(result.data);}
    catch(e){setUser(null);setError(e instanceof ApiError?e.message:'Unable to load your account. Please retry.');}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{if(isPending)return;if(session?.user?.id){void refresh();}else{setUser(null);setError('');setLoading(false);}},[session?.user?.id,isPending,refresh]);
  return <Context.Provider value={{user,loading:isPending||loading,error,refresh}}>{children}<Toaster position="top-right" richColors closeButton/></Context.Provider>;
}
export const useAuth=()=>useContext(Context);
