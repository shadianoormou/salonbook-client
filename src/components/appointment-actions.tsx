'use client';
import { useState } from 'react';
import { Appointment } from '@/lib/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { LoaderCircle,CreditCard } from 'lucide-react';
import { ConfirmDialog } from './confirm-dialog';
export function AppointmentActions({appointment:a,admin,onChange}:{appointment:Appointment;admin:boolean;onChange:()=>void}){
  const [busy,setBusy]=useState(false),[cancel,setCancel]=useState(false);
  async function update(status:'confirmed'|'cancelled'){
    setBusy(true);
    try{await api(admin?`/admin/appointments/${a._id}`:`/appointments/${a._id}/cancel`,{method:'PATCH',body:admin?JSON.stringify({status}):undefined});toast.success(`Appointment ${status}.`);setCancel(false);onChange();}
    catch(e){toast.error(e instanceof Error?e.message:'Unable to update appointment.');}finally{setBusy(false);}
  }
  async function pay(){setBusy(true);try{const {url}=await api<{url:string}>(`/payments/${a._id}/checkout`,{method:'POST'});if(new URL(url).hostname!=='checkout.stripe.com')throw new Error('Unable to open secure checkout.');window.location.assign(url);}catch(e){toast.error(e instanceof Error?e.message:'Unable to open payment.');setBusy(false);}}
  return <div className="row-actions">{admin&&a.status==='pending'&&<button className="button secondary compact" onClick={()=>void update('confirmed')} disabled={busy}>{busy&&<LoaderCircle className="spin" size={14}/>}Confirm</button>}{!admin&&a.status==='confirmed'&&a.paymentStatus==='unpaid'&&<button className="button compact" disabled={busy} onClick={()=>void pay()}>{busy?<LoaderCircle size={14} className="spin"/>:<CreditCard size={14}/>}Pay now</button>}{(a.status==='pending'||(admin&&a.status==='confirmed'))&&<button className="text-danger" onClick={()=>setCancel(true)} disabled={busy}>Cancel</button>}{cancel&&<ConfirmDialog title="Cancel this appointment?" description="This time slot will be released. This action cannot be undone; a new appointment request can be made later." confirmLabel="Cancel appointment" danger busy={busy} onCancel={()=>setCancel(false)} onConfirm={()=>void update('cancelled')}/>}</div>;
}
