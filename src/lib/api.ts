'use client';
import { authClient } from './auth-client';
export class ApiError extends Error {constructor(message:string,public status:number){super(message);}}
export async function api<T>(path:string,options:RequestInit={},protectedRequest=true):Promise<T>{
  const headers=new Headers(options.headers);
  if(!(options.body instanceof FormData))headers.set('Content-Type','application/json');
  if(protectedRequest){
    const {data,error}=await authClient.token();
    if(error || !data?.token)throw new ApiError(error?.message||'Please sign in to continue.',401);
    headers.set('Authorization',`Bearer ${data.token}`);
  }
  const response=await fetch(`/api${path}`,{...options,headers,credentials:'include',cache:'no-store'});
  const data=await response.json().catch(()=>({message:'The server could not be reached. Please try again.'}));
  if(!response.ok)throw new ApiError(data.message||'Request failed.',response.status);
  return data as T;
}
export async function uploadImage(file:File){
  if(file.size>5*1024*1024)throw new Error('Choose an image smaller than 5 MB.');
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG, or WebP image.');
  const body=new FormData();body.append('image',file);
  return (await api<{url:string}>('/uploads',{method:'POST',body})).url;
}
