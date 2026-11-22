'use client';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard,Scissors,CalendarDays,Users,CreditCard,UserRound,LogOut,Menu,X,ExternalLink } from 'lucide-react';
import { Logo } from './navbar';
import { useAuth } from './auth-provider';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
export function DashboardShell({children,role}:{children:React.ReactNode;role:'admin'|'customer'}){
  const {user}=useAuth(),path=usePathname(),router=useRouter(),[open,setOpen]=useState(false);
  const base=`/dashboard/${role}`;
  const links=role==='admin'?[['','Overview',LayoutDashboard],['/services','Manage services',Scissors],['/appointments','Appointments',CalendarDays],['/users','Customers',Users],['/transactions','Transactions',CreditCard],['/profile','My profile',UserRound]] as const:[['','Overview',LayoutDashboard],['/appointments','My appointments',CalendarDays],['/transactions','Payment history',CreditCard],['/profile','My profile',UserRound]] as const;
  async function logout(){const result=await authClient.signOut();if(result.error){toast.error(result.error.message||'Unable to sign out.');return;}router.push('/');router.refresh();}
  return <div className="dashboard"><aside className={`sidebar ${open?'is-open':''}`}><div className="sidebar-brand"><Logo/><button className="icon-button" onClick={()=>setOpen(false)} aria-label="Close sidebar"><X size={20}/></button></div><span className="sidebar-label">Your {role==='admin'?'salon':'space'}</span><nav aria-label="Dashboard navigation">{links.map(([href,label,Icon])=><Link key={href} href={base+href} onClick={()=>setOpen(false)} className={(href===''?path===base:path.startsWith(base+href))?'selected':''}><Icon size={18}/>{label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/"><ExternalLink size={17}/>Back to the salon</Link><div className="sidebar-account"><span className="avatar">{user?.name.slice(0,1)}</span><div><strong>{user?.name}</strong><span>{role==='admin'?'Salon administrator':'SalonBook member'}</span></div><button onClick={logout} aria-label="Sign out"><LogOut size={17}/></button></div></div></aside>{open&&<button className="sidebar-backdrop" onClick={()=>setOpen(false)} aria-label="Close sidebar"/>}<div className="dashboard-main"><header className="dashboard-header"><div><button className="icon-button dashboard-menu" aria-label="Open sidebar" onClick={()=>setOpen(true)}><Menu size={21}/></button><span className="dashboard-header-label">SALONBOOK <span>{role==='admin'?'A little order behind every good visit.':'Your next good feeling, all in one place.'}</span></span></div><Link href={`${base}/profile`} className="dashboard-user"><span className="avatar">{user?.name.slice(0,1)}</span><span>{user?.name.split(' ')[0]}</span></Link></header><main id="main" className="dashboard-content">{children}</main></div></div>;
}
