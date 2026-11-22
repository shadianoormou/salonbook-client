'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Protected } from '@/components/protected';
import { Loading } from '@/components/loading';
function Redirect(){const {user}=useAuth(),router=useRouter();useEffect(()=>{if(user)router.replace(`/dashboard/${user.role}`);},[user,router]);return <Loading label="Opening your dashboard…"/>;}
export default function Dashboard(){return <Protected><Redirect/></Protected>;}
