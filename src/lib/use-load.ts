'use client';
import { useCallback,useEffect,useState } from 'react';
import { api } from './api';
import { useAuth } from '@/components/auth-provider';
export function useLoad<T>(path:string|null,protectedRequest=true){
  const {user}=useAuth(),[data,setData]=useState<T|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[version,setVersion]=useState(0);
  const reload=useCallback(()=>setVersion(n=>n+1),[]);
  useEffect(()=>{
    if(!path || (protectedRequest && !user)){setLoading(false);return;}
    const controller=new AbortController();setLoading(true);setError('');
    api<T>(path,{signal:controller.signal},protectedRequest).then(result=>{if(!controller.signal.aborted)setData(result);}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Unable to load.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[path,protectedRequest,user?.id,user?._id,version]);
  return {data,error,loading,reload};
}
