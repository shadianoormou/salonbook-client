'use client';
import { CircleAlert } from 'lucide-react';
export function ErrorState({message,retry}:{message:string;retry?:()=>void}){return <div className="error-state" role="alert"><CircleAlert size={24}/><h3>We couldn’t finish that</h3><p>{message}</p>{retry&&<button className="button secondary" onClick={retry}>Try again</button>}</div>;}
